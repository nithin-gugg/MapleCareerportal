"""
Pydantic request/response schemas.
"""
from pydantic import BaseModel, Field
from typing import Optional


# ─── Request Schemas ─────────────────────────────────────────────────────────

class ScoreByURLRequest(BaseModel):
    resume_url: str = Field(..., description="Public URL pointing to a PDF resume (Google Drive, S3, etc.)")
    jd_text: str = Field(..., min_length=20, description="Full job description text")


# ─── Response Schemas ─────────────────────────────────────────────────────────

class ScoreMetadata(BaseModel):
    resume_length: int
    email: Optional[str] = None
    phone: Optional[str] = None
    matched_keywords: list[str] = []


class ScoreResponse(BaseModel):
    score: float
    status: str = "success"
    metadata: ScoreMetadata


class BatchCandidateResult(BaseModel):
    name: str
    score: float
    rank: int
    email: Optional[str] = None
    phone: Optional[str] = None
    matched_keywords: list[str] = []


class BatchScoreResponse(BaseModel):
    status: str = "success"
    total: int
    results: list[BatchCandidateResult]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str
