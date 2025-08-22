import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import PyPDF2
import pdfplumber
import pytesseract
from PIL import Image
from pdf2image import convert_from_path

# Config
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Helper: check allowed files
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Backend server is running", "port": 5001})


# Extract text from normal PDF
def extract_text_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


# Extract text from scanned PDF (OCR)
def extract_text_ocr(path):
    text = ""
    pages = convert_from_path(path)  # convert PDF → images
    for page in pages:
        text += pytesseract.image_to_string(page)
    return text.strip()


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        extracted_text = ""

        if filename.lower().endswith(".pdf"):
            # Try extracting normally
            text = extract_text_pdf(filepath)

            if text.strip() == "":
                # If empty → scanned PDF → use OCR
                extracted_text = extract_text_ocr(filepath)
            else:
                extracted_text = text

        elif filename.lower().endswith(("png", "jpg", "jpeg")):
            extracted_text = pytesseract.image_to_string(Image.open(filepath))

        return jsonify({
            "filename": filename,
            "extracted_text": extracted_text[:500] + "..." if extracted_text else "No text found"
        })

    return jsonify({"error": "File type not allowed"}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5001)
