"""
API Routes for the ML Microservice.

Endpoints:
  GET  /health        → Service health check
  POST /score         → Score a single resume (file upload or URL)
  POST /batch-score   → Score multiple resumes in one request
"""
import time
import asyncio
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from app.ml.scorer import calculate_score
from app.ml.model import get_model
from app.services.pdf_service import (
    extract_text_from_bytes,
    extract_email,
    extract_phone,
)
from app.services.url_service import download_pdf_from_url
from app.schemas.models import (
    ScoreResponse,
    ScoreMetadata,
    BatchScoreResponse,
    BatchCandidateResult,
    HealthResponse,
)
from app.core.config import get_settings
from app.core.logging import logger

router = APIRouter()


# ─── GET /health ──────────────────────────────────────────────────────────────

@router.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Returns the health status of the service and whether the ML model is in memory."""
    from app.ml.model import _model
    settings = get_settings()
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "version": settings.APP_VERSION,
    }


# ─── POST /score ──────────────────────────────────────────────────────────────

@router.post("/score", response_model=ScoreResponse, tags=["Scoring"])
async def score_resume(
    jd_text: str = Form(..., description="Full job description text"),
    resume_file: Optional[UploadFile] = File(None, description="PDF resume file upload"),
    resume_url: Optional[str] = Form(None, description="Public PDF URL (Google Drive, S3, etc.)"),
):
    """
    Score a candidate's resume against a job description.
    
    Accepts resume as either:
    - **File Upload**: Multipart form with `resume_file`
    - **URL**: Form field `resume_url` pointing to a public PDF

    Returns a match score from 0–100, extracted contact info, and matched keywords.
    """
    start_time = time.time()
    settings = get_settings()

    if not resume_file and not resume_url:
        raise HTTPException(
            status_code=422,
            detail="You must provide either 'resume_file' (upload) or 'resume_url'."
        )

    # ── 1. Get raw PDF bytes ──────────────────────────────────────────────────
    try:
        if resume_file:
            logger.info(f"Processing uploaded file: {resume_file.filename}")
            file_bytes = await resume_file.read()
        else:
            file_bytes = await download_pdf_from_url(resume_url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # ── 2. Extract text from PDF ──────────────────────────────────────────────
    try:
        resume_text = await asyncio.to_thread(extract_text_from_bytes, file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # ── 3. Score via ML ───────────────────────────────────────────────────────
    try:
        result = await asyncio.to_thread(calculate_score, resume_text, jd_text)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Threshold filtering
    score = result["score"]
    if score < settings.SCORE_THRESHOLD:
        logger.info(f"Score {score} below threshold {settings.SCORE_THRESHOLD}")

    # ── 4. Bonus feature extraction ───────────────────────────────────────────
    email = await asyncio.to_thread(extract_email, resume_text)
    phone = await asyncio.to_thread(extract_phone, resume_text)

    elapsed = round(time.time() - start_time, 3)
    logger.info(f"Score: {score} | Time: {elapsed}s | Email: {email}")

    return ScoreResponse(
        score=score,
        status="success",
        metadata=ScoreMetadata(
            resume_length=len(resume_text),
            email=email,
            phone=phone,
            matched_keywords=result["matched_keywords"],
        ),
    )


# ─── POST /batch-score ─────────────────────────────────────────────────────────

@router.post("/batch-score", response_model=BatchScoreResponse, tags=["Scoring"])
async def batch_score_resumes(
    jd_text: str = Form(..., description="Full job description text"),
    resume_files: list[UploadFile] = File(..., description="Multiple PDF resume files"),
):
    """
    Score multiple candidate resumes against a single job description.
    
    Returns results ranked by score (highest first).
    Maximum 50 resumes per request.
    """
    start_time = time.time()

    if len(resume_files) > 50:
        raise HTTPException(
            status_code=422, detail="Maximum batch size is 50 resumes per request."
        )

    async def process_single_resume(resume_file: UploadFile) -> BatchCandidateResult:
        candidate_name = resume_file.filename or "Unknown"
        # Strip extension for display name
        candidate_name = candidate_name.rsplit(".", 1)[0].replace("_", " ").title()

        try:
            file_bytes = await resume_file.read()
            resume_text = await asyncio.to_thread(extract_text_from_bytes, file_bytes)
            ml_result = await asyncio.to_thread(calculate_score, resume_text, jd_text)
            email = await asyncio.to_thread(extract_email, resume_text)
            phone = await asyncio.to_thread(extract_phone, resume_text)

            return BatchCandidateResult(
                name=candidate_name,
                score=ml_result["score"],
                rank=0,  # Will be set after sorting
                email=email,
                phone=phone,
                matched_keywords=ml_result["matched_keywords"],
            )
        except (ValueError, RuntimeError) as e:
            logger.warning(f"Skipping '{candidate_name}': {e}")
            return BatchCandidateResult(
                name=candidate_name,
                score=0.0,
                rank=0,
                matched_keywords=[f"[Error: {str(e)[:80]}]"],
            )

    # Process all resumes concurrently
    tasks = [process_single_resume(rf) for rf in resume_files]
    results = await asyncio.gather(*tasks)

    # Sort by score descending and assign ranks
    results.sort(key=lambda r: r.score, reverse=True)
    for idx, result in enumerate(results):
        result.rank = idx + 1

    elapsed = round(time.time() - start_time, 3)
    logger.info(f"Batch scored {len(results)} candidates in {elapsed}s")

    return BatchScoreResponse(
        status="success",
        total=len(results),
        results=results,
    )
