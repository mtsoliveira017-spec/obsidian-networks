import ast
import os
import subprocess
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from celery import Celery

REDIS_URL    = os.environ.get("REDIS_URL", "redis://redis:6379/0")
SESSIONS_DIR = Path(os.environ.get("SESSIONS_DIR", "/sessions"))

ALLOWED_IMPORTS = {
    "tensorflow", "keras", "numpy", "pandas",
    "sklearn", "scipy", "gymnasium", "gym",
    "os", "pathlib", "json", "math", "collections", "typing", "functools",
}
BLOCKED_ATTRS = {"system", "popen", "execve", "exec", "eval", "compile"}

celery_app = Celery("obsidian_worker", broker=REDIS_URL, backend=REDIS_URL)
celery_app.conf.update(
    task_serializer  ="json",
    result_serializer="json",
    accept_content   =["json"],
    result_expires   =SESSION_TTL if (SESSION_TTL := int(os.environ.get("SESSION_TTL_HOURS", "4")) * 3600) else 14400,
)


def validate_code(code: str) -> None:
    """AST-level validation: allowlist imports, block dangerous attributes."""
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            names = [alias.name.split(".")[0] for alias in node.names]
            for name in names:
                if name not in ALLOWED_IMPORTS:
                    raise ValueError(f"Import '{name}' is not allowed in generated code")
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
            if node.func.attr in BLOCKED_ATTRS:
                raise ValueError(f"Call to '{node.func.attr}' is not permitted")


@celery_app.task(bind=True, name="tasks.run_compilation_task")
def run_compilation_task(self, session_id: str) -> dict:
    """Execute the AI-generated model script. Expects one or more .keras files in the output dir."""
    session_dir = SESSIONS_DIR / session_id
    script_path = session_dir / "generated_script.py"
    output_dir  = session_dir / "output"

    if not script_path.exists():
        self.update_state(state="FAILURE", meta={"error": "No generated script found for this session"})
        raise FileNotFoundError("generated_script.py not found")

    code = script_path.read_text()

    try:
        validate_code(code)
    except ValueError as e:
        self.update_state(state="FAILURE", meta={"error": str(e)})
        raise

    self.update_state(state="PROGRESS", meta={"step": "compiling", "progress": 10})

    safe_env = {
        "PATH"            : "/usr/bin:/bin",
        "PYTHONUNBUFFERED": "1",
        "HOME"            : str(session_dir),
        "PYTHONPATH"      : "",
    }

    try:
        result = subprocess.run(
            ["python", "-u", str(script_path)],
            capture_output=True,
            text=True,
            timeout=300,
            cwd=str(output_dir),
            env=safe_env,
        )
    except subprocess.TimeoutExpired:
        msg = "Compilation timed out (5 minute limit)"
        self.update_state(state="FAILURE", meta={"error": msg})
        raise RuntimeError(msg)

    if result.returncode != 0:
        error_msg = (result.stderr or result.stdout or "Unknown error")[-2000:]
        self.update_state(state="FAILURE", meta={"error": error_msg})
        raise RuntimeError(f"Script failed:\n{error_msg}")

    keras_files = list(output_dir.glob("*.keras"))
    if not keras_files:
        msg = "No .keras files produced — ensure the script calls model.save('<name>.keras')"
        self.update_state(state="FAILURE", meta={"error": msg})
        raise FileNotFoundError(msg)

    return {
        "status" : "success",
        "models" : [f.name for f in keras_files],
        "sizes"  : {f.name: f.stat().st_size for f in keras_files},
    }
