import os
import sys

# Add the parent directory to sys.path so 'app' package can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

# This is required for Vercel Python runtime
handler = app
