"""
Model module (Deprecated).
Local model loading is disabled to keep memory usage <300MB.
The service now uses external Inference APIs.
"""

def warm_up_model():
    """No-op for lightweight version."""
    pass

def get_model():
    """No-op for lightweight version."""
    return None
