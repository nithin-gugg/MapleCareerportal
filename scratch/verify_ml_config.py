import sys
import os

# Add ml-service to path
sys.path.append(os.path.join(os.getcwd(), "ml-service"))

from app.core.config import get_settings

def verify_config():
    print("--- Verifying ML Service Config ---")
    settings = get_settings()
    print(f"App Name: {settings.APP_NAME}")
    print(f"App Version: {settings.APP_VERSION}")
    print(f"Debug: {settings.DEBUG}")
    print(f"Model Name: {settings.MODEL_NAME}")
    print(f"Allowed Origins: {settings.ALLOWED_ORIGINS}")
    print(f"Score Threshold: {settings.SCORE_THRESHOLD}")
    print(f"Download Timeout: {settings.URL_DOWNLOAD_TIMEOUT}")
    print("--- Verification Complete ---")

if __name__ == "__main__":
    # Create a dummy .env-local for testing
    with open("ml-service/.env-local", "w") as f:
        f.write("DEBUG=true\nALLOWED_ORIGINS=http://localhost:3000,http://test.com\n")
    
    try:
        verify_config()
    finally:
        # Cleanup
        if os.path.exists("ml-service/.env-local"):
            os.remove("ml-service/.env-local")

