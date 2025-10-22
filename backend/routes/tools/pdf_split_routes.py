import os
import io
from flask import Blueprint, request, send_file, jsonify
from PyPDF2 import PdfReader, PdfWriter

# Blueprint for PDF Split tool
pdf_split_bp = Blueprint("pdf_split_bp", __name__)

# Folder to save temporary files
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads", "pdf-split")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@pdf_split_bp.route("/api/tools/pdf-split", methods=["POST"])
def split_pdf():
    """Split a PDF file by page range."""
    try:
        uploaded_file = request.files.get("file")
        if not uploaded_file or not uploaded_file.filename.endswith(".pdf"):
            return jsonify({"error": "Please upload a valid PDF file"}), 400

        range_str = request.form.get("ranges", "")
        if not range_str or "-" not in range_str:
            return jsonify({"error": "Invalid page range format"}), 400

        try:
            start_page, end_page = map(int, range_str.split("-"))
        except ValueError:
            return jsonify({"error": "Invalid page range values"}), 400

        # Read PDF
        pdf_reader = PdfReader(uploaded_file)
        total_pages = len(pdf_reader.pages)
        if start_page < 1 or end_page > total_pages or start_page > end_page:
            return jsonify({"error": f"Page range out of bounds (1–{total_pages})"}), 400

        # Write new split PDF
        pdf_writer = PdfWriter()
        for i in range(start_page - 1, end_page):
            pdf_writer.add_page(pdf_reader.pages[i])

        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        output_stream.seek(0)

        filename = f"split_{start_page}-{end_page}.pdf"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        with open(filepath, "wb") as f:
            f.write(output_stream.getbuffer())

        output_stream.seek(0)
        return send_file(
            output_stream,
            as_attachment=True,
            download_name="split.pdf",
            mimetype="application/pdf",
        )
    except Exception as e:
        print(f"❌ PDF Split Error: {e}")
        return jsonify({"error": str(e)}), 500
