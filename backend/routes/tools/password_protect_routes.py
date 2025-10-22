import io
import os
from flask import Blueprint, request, jsonify, send_file
import pikepdf
from werkzeug.utils import secure_filename

password_protect_bp = Blueprint("password_protect_bp", __name__, url_prefix="/api/tools")

ALLOWED_EXT = {".pdf"}


def allowed_file(filename: str):
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXT


@password_protect_bp.route("/unlock-pdf/check", methods=["POST"])
def check_pdf_lock():
    """
    Check if PDF is locked (encrypted) or unlocked.
    Expects: form-data -> pdfFile
    Returns: JSON { locked: bool, message: str }
    """
    file = request.files.get("pdfFile")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        data = file.read()
        buf = io.BytesIO(data)

        try:
            with pikepdf.Pdf.open(buf):
                return jsonify({
                    "locked": False,
                    "message": "This PDF is not password protected."
                }), 200
        except pikepdf._qpdf.PasswordError:
            return jsonify({
                "locked": True,
                "message": "This PDF is password protected."
            }), 200
    except Exception as e:
        return jsonify({"error": f"Error checking PDF: {str(e)}"}), 500


@password_protect_bp.route("/password-protect", methods=["POST"])
def password_protect():
    """
    Add password to an unlocked PDF file.
    Expects: form-data -> pdf (file), password (string)
    Returns: protected PDF file (as blob)
    """
    file = request.files.get("pdf")
    password = request.form.get("password")

    if not file or not password:
        return jsonify({"error": "Missing PDF or password"}), 400

    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        data = file.read()
        input_pdf = io.BytesIO(data)
        output_pdf = io.BytesIO()

        # Open the PDF to verify it is not locked
        try:
            with pikepdf.Pdf.open(input_pdf) as pdf:
                encryption = pikepdf.Encryption(owner=password, user=password)
                pdf.save(output_pdf, encryption=encryption)
                output_pdf.seek(0)

            return send_file(
                output_pdf,
                as_attachment=True,
                download_name=f"{os.path.splitext(filename)[0]}_protected.pdf",
                mimetype="application/pdf",
            )

        except pikepdf._qpdf.PasswordError:
            return jsonify({"error": "This PDF is already password protected."}), 400

    except Exception as e:
        return jsonify({"error": f"Error protecting PDF: {str(e)}"}), 500


@password_protect_bp.route("/password-protect/reset", methods=["POST"])
def reset_pdf_password():
    """
    Reset password for an already locked PDF file.
    Expects: form-data -> pdf (file), oldPassword, newPassword
    Returns: PDF file with updated password
    """
    file = request.files.get("pdf")
    old_pw = request.form.get("oldPassword")
    new_pw = request.form.get("newPassword")

    if not file or not old_pw or not new_pw:
        return jsonify({"error": "Missing file or passwords"}), 400

    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        return jsonify({"error": "Invalid file type"}), 400

    try:
        data = file.read()
        input_pdf = io.BytesIO(data)
        output_pdf = io.BytesIO()

        try:
            with pikepdf.Pdf.open(input_pdf, password=old_pw) as pdf:
                encryption = pikepdf.Encryption(owner=new_pw, user=new_pw)
                pdf.save(output_pdf, encryption=encryption)
                output_pdf.seek(0)

            return send_file(
                output_pdf,
                as_attachment=True,
                download_name=f"{os.path.splitext(filename)[0]}_reset.pdf",
                mimetype="application/pdf",
            )
        except pikepdf._qpdf.PasswordError:
            return jsonify({"error": "Incorrect old password or cannot open PDF."}), 403

    except Exception as e:
        return jsonify({"error": f"Error resetting password: {str(e)}"}), 500
