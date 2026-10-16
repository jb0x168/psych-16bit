"""Dev smoke test: boots the game, runs a list of JS snippets with waits, screenshots after each.
usage: python smoke.py OUTDIR "js1" "js2" ...   (each snippet may be prefixed with WAIT:<ms>|)"""
import asyncio, sys, os
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


async def main():
    out = sys.argv[1]
    steps = sys.argv[2:]
    os.makedirs(out, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': 960, 'height': 540})
        logs = []
        pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
        url = os.environ.get('URL', 'file://' + ROOT + '/index.html?debug')
        await pg.goto(url)
        await pg.wait_for_timeout(400)
        for i, st in enumerate(steps):
            wait = 400
            if st.startswith('WAIT:'):
                w, st = st[5:].split('|', 1)
                wait = int(w)
            if st.startswith('KEY:'):
                for k in st[4:].split(','):
                    await pg.keyboard.press(k)
                    await pg.wait_for_timeout(60)
            elif st.startswith('CLICK:'):
                x, y = [float(v) for v in st[6:].split(',')]
                await pg.mouse.click(x * 3, y * 3)
            elif st.strip():
                try:
                    r = await pg.evaluate(st)
                    if r is not None:
                        print(f'step {i}:', r)
                except Exception as e:
                    print(f'step {i} error:', e)
            await pg.wait_for_timeout(wait)
            await pg.screenshot(path=os.path.join(out, f'{i:02d}.png'))
        for l in logs:
            print(l)
        await b.close()

asyncio.run(main())
