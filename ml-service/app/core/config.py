from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
from typing import Union


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
    ALLOWED_ORIGINS: Union[list[str], str] = ["*"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, list[str]]) -> list[str]:
        if isinstance(v, str):
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=(".env", ".env-local"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
