"""Dev-only: run an automated walkthrough of a chapter in headless Chromium.
usage: python playtest.py ch1 [OUTDIR]"""
import asyncio, sys, os, json
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


async def main():
    name = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else None
    url = os.environ.get('URL', 'file://' + ROOT + '/index.html?debug')
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': 960, 'height': 540})
        logs = []
        pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
        await pg.goto(url)
        await pg.wait_for_timeout(300)
        await pg.add_script_tag(path=os.path.join(ROOT, 'tools', 'walkthrough.js'))
        ts = os.environ.get('TIMESCALE')
        if ts:
            await pg.evaluate(f'P.timeScale = {ts}')
        task = asyncio.ensure_future(pg.evaluate(f'P.T.run("{name}")'))
        i = 0
        while not task.done():
            await asyncio.sleep(float(os.environ.get('SHOTEVERY', '1.5')))
            if out:
                os.makedirs(out, exist_ok=True)
                await pg.screenshot(path=os.path.join(out, f'{i:03d}.png'))
            i += 1
            if i > int(os.environ.get('MAXSHOTS', '400')):
                break
        res = await task
        if out:
            await pg.screenshot(path=os.path.join(out, 'final.png'))
        errs = [l for l in logs if 'pageerror' in l or '[error]' in l or 'FAIL' in l or '[warning]' in l]
        print('\n'.join(l for l in logs if '[walk]' in l)[-9000:])
        print('---- errors/warnings ----')
        print('\n'.join(errs[-60:]))
        print('---- summary ----')
        print('errors:', len(res['errors']))
        for e in res['errors']:
            print('  ', e)
        await b.close()

asyncio.run(main())
