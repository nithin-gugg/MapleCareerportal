"""
Singleton SentenceTransformer model loader.
Loads the model once on startup and reuses it across all requests.
"""
import threading
from sentence_transformers import SentenceTransformer
from app.core.logging import logger
from app.core.config import get_settings

_model: SentenceTransformer | None = None
_lock = threading.Lock()


def get_model() -> SentenceTransformer:
    """
    Returns the globally loaded SentenceTransformer model.
    Thread-safe singleton pattern.
    """
    global _model
    if _model is None:
        with _lock:
            if _model is None:  # Double-checked locking
                settings = get_settings()
                logger.info(f"Loading ML model: {settings.MODEL_NAME}")
                _model = SentenceTransformer(settings.MODEL_NAME)
                logger.info("ML model loaded successfully.")
    return _model


def warm_up_model():
    """Pre-load model at startup to avoid cold-start latency on first request."""
    get_model()
    logger.info("Model warm-up complete.")
