"""
Core ML scoring logic.
Handles text cleaning, embedding, and cosine similarity.
"""
import re
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from app.ml.model import get_model
from app.core.logging import logger

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
    # Sort alphabetically and return top N
    return sorted(list(matched))[:top_n]


from functools import lru_cache

@lru_cache(maxsize=128)
def get_cached_jd_embedding(jd_clean: str) -> np.ndarray:
    """Cache JD embeddings since they are frequently reused in batch scoring."""
    model = get_model()
    return model.encode(jd_clean, convert_to_numpy=True)

def calculate_score(resume_text: str, jd_text: str) -> dict:
    """
    Main scoring function. Returns score (0-100), and matched keywords.
    """
    if not resume_text.strip() or not jd_text.strip():
        return {"score": 0.0, "matched_keywords": []}

    try:
        model = get_model()

        resume_clean = clean_text(resume_text)
        jd_clean = clean_text(jd_text)

        logger.debug(f"Encoding texts. Resume length: {len(resume_clean)}, JD length: {len(jd_clean)}")

        resume_embedding = model.encode(resume_clean, convert_to_numpy=True)
        jd_embedding = get_cached_jd_embedding(jd_clean)

        similarity = cosine_similarity(
            jd_embedding.reshape(1, -1),
            resume_embedding.reshape(1, -1)
        )[0][0]

        score = round(float(similarity) * 100, 2)
        matched_keywords = extract_keywords(resume_text, jd_text)

        logger.info(f"Score computed: {score}")
        return {"score": score, "matched_keywords": matched_keywords}

    except Exception as e:
        logger.error(f"Scoring error: {e}", exc_info=True)
        raise RuntimeError(f"ML scoring failed: {str(e)}")
