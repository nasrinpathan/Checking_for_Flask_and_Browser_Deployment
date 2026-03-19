from flask import Flask, render_template, request, jsonify
from pathlib import Path
import sys
import os

app = Flask(__name__)

def get_desktop_folder() -> Path:
    home = Path.home()
    if sys.platform.startswith("win") or sys.platform.startswith("darwin"):
        desktop = home / "Desktop"
    else:
        desktop = Path(os.getenv("XDG_DESKTOP_DIR", home / "Desktop"))
    desktop.mkdir(parents=True, exist_ok=True)
    return desktop

@app.route("/")
def index():
    desktop = get_desktop_folder()
    videos = [f.name for f in desktop.glob("*.mp4")]
    return render_template("index.html", videos=videos)

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    if not file:
        return jsonify({"status": "error", "message": "No file"}), 400

    desktop = get_desktop_folder()
    file.save(desktop / file.filename)

    return jsonify({"status": "ok", "saved_to": str(desktop / file.filename)})

if __name__ == "__main__":
    app.run(debug=True)
