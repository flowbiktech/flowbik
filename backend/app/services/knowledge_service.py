import json
from pathlib import Path

def load_knowledge_base():
    kb_path = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"
    with open(kb_path, "r", encoding="utf-8") as f:
        return json.load(f)
