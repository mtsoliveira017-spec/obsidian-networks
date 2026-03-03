import asyncio
import os
import shutil
import time
import uuid
from dataclasses import dataclass
from pathlib import Path

SESSIONS_DIR = Path(os.environ.get("SESSIONS_DIR", "/sessions"))
SESSION_TTL  = int(os.environ.get("SESSION_TTL_HOURS", "4")) * 3600


@dataclass
class SessionData:
    created_at  : float
    session_dir : Path
    dataset_path: str | None = None
    analysis    : dict | None = None
    environment : dict | None = None
    task_id     : str | None = None


_sessions: dict[str, SessionData] = {}


def create_session() -> str:
    sid         = str(uuid.uuid4())
    session_dir = SESSIONS_DIR / sid
    output_dir  = session_dir / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    _sessions[sid] = SessionData(created_at=time.time(), session_dir=session_dir)
    return sid


def get_session(sid: str) -> SessionData | None:
    session = _sessions.get(sid)
    if not session:
        return None
    if time.time() - session.created_at > SESSION_TTL:
        _delete_session(sid)
        return None
    return session


def session_expires_at(session: SessionData) -> int:
    return int(session.created_at + SESSION_TTL)


def _delete_session(sid: str) -> None:
    _sessions.pop(sid, None)
    shutil.rmtree(SESSIONS_DIR / sid, ignore_errors=True)


async def cleanup_expired_sessions() -> None:
    """Background asyncio task: runs every 5 min, purges expired sessions."""
    while True:
        await asyncio.sleep(300)
        now     = time.time()
        expired = [sid for sid, s in list(_sessions.items()) if now - s.created_at > SESSION_TTL]
        for sid in expired:
            _delete_session(sid)
