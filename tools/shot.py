"""Headless screenshot helper (dev only).
usage: python shot.py URL OUT.png [--w 1280 --h 720] [--eval JS] [--wait MS]"""
import asyncio, argparse
from playwright.async_api import async_playwright


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('url'); ap.add_argument('out')
    ap.add_argument('--w', type=int, default=1280); ap.add_argument('--h', type=int, default=720)
    ap.add_argument('--eval', default=None); ap.add_argument('--wait', type=int, default=500)
    ap.add_argument('--full', action='store_true')
    a = ap.parse_args()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg = await b.new_page(viewport={'width': a.w, 'height': a.h})
        logs = []
        pg.on('console', lambda m: logs.append(f'[{m.type}] {m.text}'))
        pg.on('pageerror', lambda e: logs.append(f'[pageerror] {e}'))
        await pg.goto(a.url)
        await pg.wait_for_timeout(a.wait)
        if a.eval:
            r = await pg.evaluate(a.eval)
            if r is not None:
                print('eval:', r)
            await pg.wait_for_timeout(a.wait)
        await pg.screenshot(path=a.out, full_page=a.full)
        for l in logs:
            print(l)
        await b.close()

asyncio.run(main())
