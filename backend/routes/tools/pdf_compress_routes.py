import os
import subprocess
from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

# Create Blueprint
pdf_compress_bp = Blueprint("pdf_compress_bp", __name__)

# Upload folder for temporary storage
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "pdf-compress")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@pdf_compress_bp.route("/api/tools/pdf/compress", methods=["POST"])
@jwt_required()  # ✅ Require valid JWT (matches frontend header)
def compress_pdf():
    """
    Compress a PDF using Ghostscript.
    Form-data: { file: <PDF>, mode: <extreme|recommended|low> }
    """
    try:
        # --- Validate file ---
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if not file or file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        filename = secure_filename(file.filename)
        if not filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files are supported"}), 400

        # Save original file
        input_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(input_path)

        # --- Mode Handling ---
        mode = request.form.get("mode", "recommended").lower()
        settings_map = {
            "extreme": "/screen",      # smallest file size
            "recommended": "/ebook",   # good balance
            "low": "/printer"          # higher quality
        }
        pdf_setting = settings_map.get(mode, "/ebook")

        output_filename = f"compressed_{filename}"
        output_path = os.path.join(UPLOAD_FOLDER, output_filename)

        # --- Ghostscript Command ---
        gs_command = [
            "gswin64c" if os.name == "nt" else "gs",
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            f"-dPDFSETTINGS={pdf_setting}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={output_path}",
            input_path
        ]

        subprocess.run(gs_command, check=True)

        # --- Size Stats ---
        original_size = os.path.getsize(input_path) / (1024 * 1024)
        compressed_size = os.path.getsize(output_path) / (1024 * 1024)

        # --- Return compressed PDF ---
        response = send_file(
            output_path,
            as_attachment=True,
            download_name=output_filename,
            mimetype="application/pdf"
        )
        response.headers["x-original-size-mb"] = f"{original_size:.2f}"
        response.headers["x-compressed-size-mb"] = f"{compressed_size:.2f}"
        return response

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Compression failed: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
