"""
FastAPI Application Entry Point.

Architecture:
- Lifespan context manager for model warm-up on startup.
- CORS configured for Next.js integration.
- All routes prefixed with /api/v1.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.ml.model import warm_up_model
from app.core.config import get_settings
from app.core.logging import logger, setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown lifecycle events.
    Model is pre-loaded here so the first request has no cold start.
    """
    settings = get_settings()
    setup_logging(debug=settings.DEBUG)
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info("Pre-loading ML model at startup...")
    warm_up_model()
    logger.info("Service ready.")
    yield
    logger.info("Shutting down ML service.")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
## Maple HRMS — AI Resume Scoring Microservice

A production-ready ML microservice that scores candidate resumes against job descriptions
using **sentence-transformers** and **cosine similarity**.

### Key Endpoints
- `POST /api/v1/score` — Score a single resume (upload or URL)
- `POST /api/v1/batch-score` — Rank multiple candidates at once
- `GET /api/v1/health` — Service health check

### Integrates with
- Next.js HRMS frontend (via `fetch()`)
- Google Drive URLs
- Any public S3 or HTTP URL
        """,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS for Next.js ──────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Mount Routes ──────────────────────────────────────────────────────────
    app.include_router(router, prefix="/api/v1")

    return app


app = create_app()
