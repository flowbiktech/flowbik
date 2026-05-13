import os
import sys

# Add the backend directory to sys.path so 'app' package can be found
# Since this file is in /api/index.py, the backend is in /backend/
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.append(path)

from app.main import app

# This is required for Vercel Python runtime
handler = app
