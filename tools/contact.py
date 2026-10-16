"""Dev-only: build a contact sheet of PNG frames. usage: python contact.py DIR OUT.png START STEP [COUNT] [COLS]"""
import asyncio, sys, os
from playwright.async_api import async_playwright


async def main():
    d, out, start, step = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    count = int(sys.argv[5]) if len(sys.argv) > 5 else 16
    cols = int(sys.argv[6]) if len(sys.argv) > 6 else 4
    files = sorted(f for f in os.listdir(d) if f.endswith('.png') and f[0].isdigit())
    pick = files[start::step][:count]
    w = 480
    html = '<html><body style="margin:0;background:#111;display:grid;grid-template-columns:repeat(%d,%dpx);gap:4px;font:12px monospace;color:#fff">' % (cols, w)
    for f in pick:
        html += f'<div><img src="file://{os.path.join(d, f)}" width="{w}" style="display:block;image-rendering:pixelated"><span>{f}</span></div>'
    html += '</body></html>'
    tmp = os.path.join(d, '_sheet.html')
    open(tmp, 'w').write(html)
    rows = (len(pick) + cols - 1) // cols
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': cols * (w + 4), 'height': rows * (w * 9 // 16 + 22)})
        await pg.goto('file://' + tmp)
        await pg.wait_for_timeout(300)
        await pg.screenshot(path=out, full_page=True)
        await b.close()

asyncio.run(main())
