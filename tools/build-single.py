#!/usr/bin/env python3
"""Build a single self-contained HTML file of the app (all CSS, JS, fonts, data and libraries inlined).
It opens with a double-click (file://), works without internet and without a server.
Usage:  python3 tools/build-single.py   ->  dist/sticker-creator.html"""
import base64, os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

def read(p, mode='r'):
    with open(p, mode) as f:
        return f.read()

def js_safe(code):
    # keep the HTML parser inside the <script> element
    return code.replace('</script', '<\\/script').replace('</SCRIPT', '<\\/SCRIPT').replace('<!--', '<\\!--')

html = read('index.html')

# 1. fonts.css with fonts as data: URIs
def font_uri(m):
    data = base64.b64encode(read(m.group(1), 'rb')).decode()
    return f"url(data:font/woff2;base64,{data})"
fonts_css = re.sub(r"url\((fonts/[^)]+\.woff2)\)", font_uri, read('fonts.css'))
html = html.replace('<link rel="stylesheet" href="fonts.css">', f'<style>\n{fonts_css}</style>')
html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>\n{read("style.css")}</style>')

# 2. PWA links are meaningless in a single file
html = re.sub(r'<link rel="manifest"[^>]*>\n?', '', html)
icon = base64.b64encode(read('icons/icon-192.png', 'rb')).decode()
html = html.replace('<link rel="apple-touch-icon" href="icons/icon-192.png">', f'<link rel="apple-touch-icon" href="data:image/png;base64,{icon}">')

# 3. eager scripts inline; lazily loaded libraries/data embedded as inert blocks read by loadScript()
lazy = ['vendor/html2canvas.min.js', 'vendor/jspdf.umd.min.js', 'vendor/xlsx.mini.min.js', 'vendor/bwip-js-min.js',
        'data/label-db.js', 'data/icons.js']
blocks = ''.join(f'<script type="text/plain" data-src="{p}">{js_safe(read(p))}</script>\n' for p in lazy)
for p in ['vendor/JsBarcode.all.min.js', 'vendor/qrcode.js']:
    html = html.replace(f'<script src="{p}"></script>', f'<script>/* {p} */\n{js_safe(read(p))}</script>')
html = html.replace('<script src="app.js"></script>', blocks + f'<script>\n{js_safe(read("app.js"))}</script>')

assert '<script src="vendor/' not in html and 'href="fonts.css"' not in html and 'src="app.js"' not in html
os.makedirs('dist', exist_ok=True)
with open('dist/sticker-creator.html', 'w') as f:
    f.write(html)
print(f"dist/sticker-creator.html  {os.path.getsize('dist/sticker-creator.html') / 1048576:.1f} MB")
