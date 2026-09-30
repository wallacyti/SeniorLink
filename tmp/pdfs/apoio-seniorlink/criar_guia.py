from pathlib import Path
import json
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT = Path(r'C:\Users\wallacy.souza\Documents\SeniorLink')
OUT = ROOT / 'output' / 'pdf' / 'SeniorLink-guia-de-fala.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, file in [('Segoe', 'segoeui.ttf'), ('SegoeBold', 'segoeuib.ttf'), ('SegoeItalic', 'segoeuii.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path(r'C:\Windows\Fonts') / file)))
pdfmetrics.registerFontFamily('Segoe', normal='Segoe', bold='SegoeBold', italic='SegoeItalic', boldItalic='SegoeBold')

W, H = A4
M = 44
CW = W - M * 2
NAVY = '#123B63'
BLUE = '#1764A5'
TEAL = '#008F86'
TEXT = '#29465C'
MUTED = '#5C7385'
PALE = '#EDF6FD'
LINE = '#D6E5EF'

c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('SeniorLink | Guia de fala: conectar problema e solução')
c.setAuthor('SeniorLink')
c.setSubject('Material de apoio para apresentação do projeto acadêmico')
layout = []

def p(text, x, top, width, size=11, leading=None, color=TEXT, bold=False):
    style = ParagraphStyle('p', fontName='SegoeBold' if bold else 'Segoe', fontSize=size,
                           leading=leading or size * 1.4, textColor=HexColor(color),
                           spaceAfter=0, allowWidows=0, allowOrphans=0)
    item = Paragraph(text, style)
    _, height = item.wrap(width, H)
    if top + height > H - 46:
        raise ValueError(f'Text exceeds content area: {text[:70]} at {top + height:.1f}')
    item.drawOn(c, x, H - top - height)
    layout.append({'page': c.getPageNumber(), 'top': round(top, 1), 'bottom': round(top + height, 1), 'text': text[:90]})
    return top + height

def box(top, height, fill=PALE, border=None, x=M, width=CW, radius=10):
    c.setFillColor(HexColor(fill))
    c.setStrokeColor(HexColor(border or fill))
    c.roundRect(x, H - top - height, width, height, radius, fill=1, stroke=bool(border))

def small(text, top, color=BLUE, x=M):
    return p(text, x, top, CW, size=9, leading=12, color=color, bold=True)

def header(page, label):
    c.setFillColor(HexColor(TEAL))
    c.roundRect(M, H - 44, 5, 15, 2, fill=1, stroke=0)
    p('SeniorLink', M + 14, 27, 140, 12, 16, NAVY, True)
    p('GUIA DE APRESENTAÇÃO', W - M - 185, 30, 185, 8.4, 12, MUTED)
    c.setStrokeColor(HexColor(LINE))
    c.line(M, 55, W - M, 55)
    # Footer stays outside the normal content validation area.
    c.setFont('Segoe', 8.3)
    c.setFillColor(HexColor(MUTED))
    c.drawString(M, 30, 'Cuidado hoje, mais liberdade amanhã.')
    c.drawRightString(W - M, 30, f'{label}  |  {page} / 3')


# Page 1: a complete, natural spoken script.
header(1, 'Sua fala')
p('Conectar o problema<br/>à solução', M, 77, CW, 27, 32, NAVY, True)
p('Sua parte é explicar por que o SeniorLink faz sentido diante dos problemas apresentados pelo grupo.',
  M, 155, CW, 11.4, 16)
small('FALA PRINCIPAL  |  CERCA DE 1 MINUTO E MEIO', 208)

speech = [
    'Diante desse cenário, o desafio é oferecer mais apoio à pessoa idosa, preservando sua independência. É aí que entra o <b>SeniorLink</b>.',
    'A nossa proposta é reunir, em um aplicativo simples, recursos que respondam a necessidades do dia a dia.',
    'Por exemplo: se a pessoa se desorientar durante uma saída, o <b>compartilhamento da localização</b>, com sua autorização, pode ajudar um contato de confiança a encontrá-la. Para esquecimentos de horários e compromissos, pensamos em <b>lembretes</b>.',
    'Quando for necessário pedir ajuda, a ideia é facilitar o acesso ao <b>botão de emergência e à ligação rápida</b>. O perfil também foi pensado para reunir informações importantes, como medicamentos, alergias e contatos, facilitando a consulta.',
    'Mas ter o aplicativo no celular não basta: a pessoa precisa saber utilizá-lo. Por isso, o projeto inclui uma <b>interface simples e orientações básicas de uso</b>, tanto para a pessoa idosa quanto para quem participa do seu cuidado.',
    'Assim, queremos aproximar essa rede de apoio e ampliar a autonomia. Nesta etapa, o MVP apresenta as telas e os fluxos dessa proposta. <b>Agora, vamos mostrar como isso aparece no aplicativo.</b>',
]
y = 240
for text in speech:
    y = p(text, M, y, CW, 12.7, 18.1) + 12

box(692, 80)
small('A IDEIA QUE VOCÊ PRECISA TRANSMITIR', 706, x=M + 16)
p('Cada recurso responde a uma necessidade. O objetivo é apoiar a segurança e a autonomia da pessoa idosa.',
  M + 16, 727, CW - 32, 12.3, 17, NAVY, True)
c.showPage()


# Page 2: understand the connection, not just memorize a list of functions.
header(2, 'Entenda a proposta')
p('Da dificuldade ao recurso', M, 77, CW, 25, 31, NAVY, True)
p('Pense sempre nesta sequência: situação do cotidiano, recurso previsto e benefício esperado.',
  M, 120, CW, 11.4, 16)

style_cell = ParagraphStyle('cell', fontName='Segoe', fontSize=10.5, leading=14.5, textColor=HexColor(TEXT))
style_head = ParagraphStyle('head', fontName='SegoeBold', fontSize=9.3, leading=13, textColor=white)
rows = [
    ['SITUAÇÃO', 'PROPOSTA DO SENIORLINK', 'BENEFÍCIO ESPERADO'],
    ['Desorientação durante uma saída.', '<b>Localização em tempo real</b>, compartilhada com autorização.', 'Ajudar um contato de confiança a localizar a pessoa.'],
    ['Esquecimento de um horário ou compromisso.', '<b>Lembretes</b> de medicamentos e compromissos.', 'Apoiar a organização da rotina.'],
    ['Necessidade de pedir ajuda.', '<b>SOS e ligação rápida</b> para contatos de confiança.', 'Facilitar o pedido de ajuda quando a pessoa consegue acionar o recurso.'],
    ['Dificuldade para encontrar informações importantes.', '<b>Perfil</b> com medicamentos, alergias e contatos.', 'Reunir informações em um lugar de fácil consulta.'],
    ['Dificuldade para navegar pelo aplicativo.', '<b>Interface simples</b> e recursos fáceis de identificar.', 'Tornar o uso mais compreensível.'],
    ['Pouca familiaridade com o celular.', '<b>Aprender e treinamento básico</b> para a pessoa idosa e sua rede de apoio.', 'Apoiar a confiança e a autonomia digital.'],
]
data = [[Paragraph(cell, style_head if i == 0 else style_cell) for cell in row] for i, row in enumerate(rows)]
table = Table(data, colWidths=[CW * .28, CW * .36, CW * .36])
table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), HexColor(NAVY)),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#F3F8FC'), white]),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 11),
    ('RIGHTPADDING', (0, 0), (-1, -1), 11),
    ('TOPPADDING', (0, 0), (-1, -1), 11),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 11),
    ('LINEBELOW', (0, 1), (-1, -1), .4, HexColor(LINE)),
]))
_, th = table.wrap(CW, H)
table.drawOn(c, M, H - 173 - th)
y = 173 + th + 25
small('UM EXEMPLO PARA EXPLICAR COM SUAS PALAVRAS', y)
y = p('Imagine que a dona Maria quer continuar saindo sozinha para suas atividades. A proposta é que ela possa compartilhar sua localização com alguém de confiança, consultar seus lembretes e encontrar facilmente como pedir ajuda. O treinamento entra para que ela saiba usar esses recursos.',
      M, y + 23, CW, 11.4, 16) + 12
y = p('<b>Feche o exemplo:</b> “Percebe? A ideia é dar apoio para ela manter sua rotina com mais autonomia.”',
      M, y, CW, 11.4, 16)
if y > 770:
    raise ValueError(f'Page 2 content too tall: {y}')
c.showPage()


# Page 3: a consultation page for use beside the presentation laptop.
header(3, 'Cola rápida')
p('Para consultar na hora', M, 77, CW, 25, 31, NAVY, True)
p('Se der branco, retome a sequência abaixo e escolha um exemplo do dia a dia.',
  M, 120, CW, 11.2, 16)
box(163, 55, fill=NAVY)
p('APOIAR  •  LOCALIZAR  •  LEMBRAR<br/>PEDIR AJUDA  •  ENSINAR  •  AUTONOMIA',
  M + 16, 174, CW - 32, 12, 17, '#FFFFFF', True)

small('VERSÃO CURTA  |  CERCA DE 30 SEGUNDOS', 240)
y = p('O SeniorLink nasceu para apoiar a segurança sem tirar a independência da pessoa idosa. A proposta reúne localização compartilhada, lembretes, informações importantes e formas simples de pedir ajuda. Também inclui treinamento básico, porque ter tecnologia não basta: é preciso saber usá-la. Essas telas mostram como imaginamos organizar tudo isso no aplicativo.',
      M, 263, CW, 11.7, 16.3)

small('RESPOSTAS CURTAS PARA PERGUNTAS DO PÚBLICO', y + 24)
y += 48
qa = [
    ('Isso já funciona de verdade?',
     'O site expõe as telas e permite explorar uma simulação. A localização ao vivo, as ligações e o envio de alertas ainda não estão conectados nessa demonstração.'),
    ('O aplicativo detecta quedas automaticamente?',
     'Não nesta proposta demonstrada. O SOS depende de a pessoa acionar o recurso. Não apresentamos prevenção ou detecção automática de quedas.'),
    ('Qual é o diferencial da proposta?',
     'Reunir apoio à rotina, informações e contatos em uma interface simples, junto com orientações de uso. Evite afirmar que é o único aplicativo com esses recursos.'),
    ('Por que incluir treinamento?',
     'Porque possuir um celular não significa saber usar todas as funções. A orientação ajuda a pessoa a entender os recursos e usá-los com mais confiança.'),
]
for question, answer in qa:
    y = p(question, M, y, CW, 10.6, 14.5, NAVY, True)
    y = p(answer, M, y + 3, CW, 10.6, 14.5) + 13

y += 2
box(y, 53)
p('<b>Ensaio de 3 minutos:</b> leia a fala em voz alta; repita olhando apenas as palavras-chave; termine passando a palavra para quem vai mostrar o MVP.',
  M + 12, y + 10, CW - 24, 10.5, 14.5)
y += 64
p('Base: texto enviado pela equipe e Roteiro SeniorLink.pdf, seção 2. Os limites da exibição foram conferidos no README do site em 29/09/2026. Os benefícios descritos são objetivos do projeto, ainda sem resultados de uso comprovados neste material.',
  M, y, CW, 8, 10.6, MUTED)
c.save()

reader = PdfReader(OUT)
assert len(reader.pages) == 3, len(reader.pages)
full_text = '\n'.join(page.extract_text() for page in reader.pages)
for phrase in ['Conectar o problema', 'Da dificuldade ao recurso', 'Para consultar na hora', 'autonomia']:
    assert phrase in full_text, phrase
assert '\ufffd' not in full_text
(ROOT / 'tmp' / 'pdfs' / 'apoio-seniorlink' / 'guia-layout.json').write_text(json.dumps(layout, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'output': str(OUT), 'pages': len(reader.pages), 'bytes': OUT.stat().st_size,
                  'speech_words': len(' '.join(speech).split())}, ensure_ascii=False))
