import os
import sys

# Add the backend directory to sys.path so 'app' package can be found.
# We insert multiple candidate paths to handle Vercel's CWD variations.
_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
_backend_from_file = os.path.join(_root, 'backend')
_backend_from_cwd  = os.path.join(os.getcwd(), 'backend')

for _p in [_backend_from_file, _backend_from_cwd, _root]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from app.main import app

# This is required for Vercel Python runtime
handler = app

