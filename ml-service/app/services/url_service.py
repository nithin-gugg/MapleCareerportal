"""
Service for downloading resume PDFs from public URLs.
Handles Google Drive, S3, and generic public HTTP URLs.
"""
import re
import httpx
from collections import OrderedDict
from app.core.logging import logger
from app.core.config import get_settings

# Simple in-memory LRU cache for downloaded PDF bytes
_url_cache = OrderedDict()
MAX_CACHE_SIZE = 100


def _convert_google_drive_url(url: str) -> str:
    """
    Converts a Google Drive sharing link to a direct download URL.
    Input: https://drive.google.com/file/d/FILE_ID/view?...
    Output: https://drive.google.com/uc?export=download&id=FILE_ID
    """
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if match:
        file_id = match.group(1)
        logger.debug(f"Converted Google Drive URL. File ID: {file_id}")
        return f"https://drive.google.com/uc?export=download&id={file_id}"
    return url


async def download_pdf_from_url(url: str) -> bytes:
    """
    Downloads a PDF from a public URL and returns its raw bytes.
    Handles Google Drive URLs specially.
    Raises ValueError for invalid URLs or failed downloads.
    """
    settings = get_settings()

    if not url or not url.startswith("http"):
        raise ValueError(f"Invalid URL provided: '{url}'")

    # Auto-convert Google Drive share links
    if "drive.google.com" in url:
        url = _convert_google_drive_url(url)

    # Check cache
    if url in _url_cache:
        logger.info(f"Cache hit for downloaded PDF: {url}")
        return _url_cache[url]

    logger.info(f"Downloading resume from URL: {url}")

    try:
        async with httpx.AsyncClient(
            timeout=settings.URL_DOWNLOAD_TIMEOUT,
            follow_redirects=True,
            headers={"User-Agent": "MapleHRMS-MLService/1.0"}
        ) as client:
            response = await client.get(url)
            response.raise_for_status()

        content_type = response.headers.get("content-type", "")
        if "pdf" not in content_type and "octet-stream" not in content_type:
            logger.warning(f"Unexpected content-type from URL download: {content_type}")

        logger.info(f"Downloaded {len(response.content)} bytes from URL.")
        
        # Save to cache
        _url_cache[url] = response.content
        if len(_url_cache) > MAX_CACHE_SIZE:
            _url_cache.popitem(last=False)  # Remove oldest item

        return response.content

    except httpx.TimeoutException:
        raise ValueError(f"Request to '{url}' timed out after {settings.URL_DOWNLOAD_TIMEOUT}s.")
    except httpx.HTTPStatusError as e:
        raise ValueError(f"HTTP {e.response.status_code} when downloading resume from URL.")
    except Exception as e:
        logger.error(f"URL download error: {e}", exc_info=True)
        raise ValueError(f"Failed to download file from URL: {str(e)}")
