import fitz  # PyMuPDF
import pdfplumber
import pytesseract
from PIL import Image
import io
import logging

class PDFExtractor:
    def __init__(self, pdf_path: str, extract_images: bool = True, run_ocr: bool = True, save_images_to: str = None):
        """
        Initializes the PDF Extractor.
        """
        self.pdf_path = pdf_path
        self.extract_images = extract_images
        self.run_ocr = run_ocr
        self.save_images_to = save_images_to

    def extract(self) -> dict:
        """
        Extracts content from the PDF, returning a dictionary containing the extracted data.
        It uses PyMuPDF for quick text and image OCR (using pytesseract), 
        and pdfplumber for table extraction.
        """
        content_parts = []
        
        try:
            # 1. Extract text and images with PyMuPDF
            doc = fitz.open(self.pdf_path)
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                
                # Text extraction
                text = page.get_text("text")
                if text.strip():
                    content_parts.append(f"--- Page {page_num + 1} Text ---\n{text.strip()}")
                
                # Image extraction and OCR
                if self.extract_images and self.run_ocr:
                    image_list = page.get_images(full=True)
                    for img_index, img in enumerate(image_list):
                        try:
                            xref = img[0]
                            base_image = doc.extract_image(xref)
                            image_bytes = base_image["image"]
                            
                            # Using pytesseract for OCR on extracted image
                            image = Image.open(io.BytesIO(image_bytes))
                            ocr_text = pytesseract.image_to_string(image)
                            
                            if ocr_text.strip():
                                content_parts.append(f"--- Page {page_num + 1} Image {img_index + 1} OCR ---\n{ocr_text.strip()}")
                        except Exception as e:
                            logging.warning(f"Failed to OCR image on page {page_num + 1}: {e}")

            # 2. Extract tables with pdfplumber
            try:
                with pdfplumber.open(self.pdf_path) as pdf:
                    for page_num, page in enumerate(pdf.pages):
                        tables = page.extract_tables()
                        for table_idx, table in enumerate(tables):
                            table_str = ""
                            for row in table:
                                # Clean row items and join with pipe
                                clean_row = [str(item).replace('\n', ' ') if item else "" for item in row]
                                table_str += " | ".join(clean_row) + "\n"
                            if table_str.strip():
                                content_parts.append(f"--- Page {page_num + 1} Formatted Table {table_idx + 1} ---\n{table_str.strip()}")
            except Exception as e:
                logging.warning(f"Failed to extract tables via pdfplumber: {e}")

            return {"content": "\n\n".join(content_parts)}
            
        except Exception as e:
            logging.error(f"Error extracting PDF from path {self.pdf_path}: {e}")
            raise

    @staticmethod
    def to_plain_text(content: dict, display_name: str = "") -> str:
        """
        Converts the extracted dictionary content into a single unified plain text string.
        """
        header = f"=== Document: {display_name} ===\n" if display_name else ""
        return header + content.get("content", "")
