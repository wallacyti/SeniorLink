from pathlib import Path
from pypdf import PdfReader
from pdf2image import convert_from_path
import json

root = Path(r'C:\Users\wallacy.souza\Documents\SeniorLink')
pdf = root / 'output/pdf/SeniorLink-documentacao-tecnica.pdf'
render = root / 'tmp/documentacao-tecnica/render'
render.mkdir(parents=True, exist_ok=True)
reader = PdfReader(pdf)
for i, page in enumerate(reader.pages, 1):
    text = page.extract_text() or ''
    lines = text.splitlines()
    print(json.dumps({'page':i, 'words':len(text.split()),'first':lines[:3],'last':lines[-4:]},ensure_ascii=False))
    (render/f'page-{i}.txt').write_text(text,encoding='utf-8')
images = convert_from_path(str(pdf),dpi=125,poppler_path=r'C:\Users\wallacy.souza\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin')
for i,im in enumerate(images,1):
    im.save(render / f'page-{i}.png')
print(f'Rendered {len(images)} pages')
