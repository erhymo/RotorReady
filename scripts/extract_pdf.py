import pdfplumber

pdf_path = "qrh/QRH_Issue3.pdf"  # Endre til din filsti hvis nødvendig
output_path = "qrh/QRH_Issue3.txt"

with pdfplumber.open(pdf_path) as pdf:
    all_text = ""
    for page in pdf.pages:
        page_text = page.extract_text()
        if page_text:
            all_text += page_text + "\n\n"

with open(output_path, "w", encoding="utf-8") as f:
    f.write(all_text)

print(f"Tekst lagret i {output_path}")
