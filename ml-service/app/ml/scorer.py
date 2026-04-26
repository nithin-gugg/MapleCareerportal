"""
Core ML scoring logic.
Refactored for low memory usage (<300MB).
Uses Hugging Face Inference API for semantic similarity instead of local torch/transformers.
"""
import re
import httpx
import asyncio
from app.core.config import get_settings
from app.core.logging import logger

settings = get_settings()

STOPWORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
    'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
    'further', 'once', 'here', 'there', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'is', 'are',
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
    'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might',
    'must', 'can', 'could', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
}


def clean_text(text: str) -> str:
    """Lowercase, strip special chars, remove stopwords."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    words = text.split()
    cleaned = " ".join(w for w in words if w not in STOPWORDS and len(w) > 1)
    return cleaned


def extract_keywords(resume_text: str, jd_text: str, top_n: int = 15) -> list[str]:
    """
    Returns top keywords from the JD that also appear in the resume.
    """
    jd_words = set(clean_text(jd_text).split())
    resume_words = set(clean_text(resume_text).split())
    matched = jd_words & resume_words
    return sorted(list(matched))[:top_n]


async def query_hf_similarity(source_sentence: str, sentences: list[str]) -> list[float]:
    """
    Calls Hugging Face Inference API to get similarity scores.
    """
    if not settings.HF_API_TOKEN:
        logger.warning("HF_API_TOKEN not set. Scoring will fallback to basic keyword matching.")
        return [0.0] * len(sentences)

    headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}
    payload = {
        "inputs": {
            "source_sentence": source_sentence,
            "sentences": sentences
        }
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(settings.HF_API_URL, headers=headers, json=payload)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"HF API Error {response.status_code}: {response.text}")
                return [0.0] * len(sentences)
    except Exception as e:
        logger.error(f"HF API Exception: {e}")
        return [0.0] * len(sentences)


async def calculate_score(resume_text: str, jd_text: str) -> dict:
    """
    Main scoring function. 
    Uses async API call for semantic similarity + local keyword extraction.
    """
    if not resume_text.strip() or not jd_text.strip():
        return {"score": 0.0, "matched_keywords": []}

    try:
        resume_clean = clean_text(resume_text)
        jd_clean = clean_text(jd_text)

        # Truncate to avoid API limits (usually 512 tokens)
        # Approximate 4 chars per token
        jd_trunc = jd_clean[:1500]
        resume_trunc = resume_clean[:1500]

        # Get semantic similarity from HF API
        scores = await query_hf_similarity(jd_trunc, [resume_trunc])
        similarity = scores[0] if scores else 0.0

        # Local Keyword Match (Bonus boost)
        matched_keywords = extract_keywords(resume_text, jd_text)
        keyword_score = len(matched_keywords) / 10.0 if matched_keywords else 0.0
        
        # Combine scores (80% semantic, 20% keyword match)
        final_similarity = (similarity * 0.8) + (min(keyword_score, 1.0) * 0.2)
        
        score = round(float(final_similarity) * 100, 2)
        
        logger.info(f"Score computed via HF API: {score}")
        return {"score": score, "matched_keywords": matched_keywords}

    except Exception as e:
        logger.error(f"Scoring error: {e}")
        return {"score": 0.0, "matched_keywords": [], "error": str(e)}
