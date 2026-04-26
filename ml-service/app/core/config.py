"""
Core configuration settings loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Maple HRMS AI Scoring Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Model
    MODEL_NAME: str = "all-MiniLM-L6-v2"
    SCORE_THRESHOLD: float = 0.0  # Minimum score to include in results (0-100)

    # Request timeout for URL downloads (seconds)
    URL_DOWNLOAD_TIMEOUT: int = 15

    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
