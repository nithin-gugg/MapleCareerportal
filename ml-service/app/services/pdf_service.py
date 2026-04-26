"""
PDF text extraction service using pdfminer.
Also handles bonus features: email and phone extraction.
"""
import re
from io import BytesIO
from pdfminer.high_level import extract_text
from pdfminer.pdfpage import PDFPage
from app.core.logging import logger


def extract_text_from_bytes(file_bytes: bytes) -> str:
    """
    Extract raw text from a PDF file given as bytes.
    Raises ValueError for invalid/corrupt PDFs.
    """
    if not file_bytes:
        raise ValueError("Received empty file bytes.")

    # Basic PDF header check
    if not file_bytes[:5] == b'%PDF-':
        raise ValueError("File does not appear to be a valid PDF.")

    try:
        text = extract_text(BytesIO(file_bytes))
        if not text or not text.strip():
            raise ValueError("PDF was parsed but contained no extractable text (may be image-based).")
        logger.debug(f"Extracted {len(text)} characters from PDF.")
        return text.strip()
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"PDF extraction error: {e}", exc_info=True)
        raise ValueError(f"Failed to parse PDF: {str(e)}")


def extract_email(text: str) -> str | None:
    """Extract the first email address found in text."""
    pattern = r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[a-zA-Z]{2,}\b'
    match = re.search(pattern, text)
    return match.group(0) if match else None


def extract_phone(text: str) -> str | None:
    """Extract the first phone number found in text (handles various formats)."""
    pattern = r'(\+?\d[\d\s\-().]{7,}\d)'
    match = re.search(pattern, text)
    if match:
        # Clean up extra whitespace
        return re.sub(r'\s+', ' ', match.group(0)).strip()
    return None
