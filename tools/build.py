"""Bundle the game into single self-contained HTML files.

    python3 tools/build.py

Outputs:
    dist/psych.html     standalone page (double-click to play, works offline from file://)
    dist/artifact.html  same content without the <html>/<head>/<body> skeleton (for hosted embeds)

Script order is taken from index.html (between <!--SCRIPTS--> and <!--/SCRIPTS-->), so adding
a chapter = add its <script> tag to index.html, then rebuild.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def main():
    index = read('index.html')
    block = re.search(r'<!--SCRIPTS-->(.*?)<!--/SCRIPTS-->', index, re.S).group(1)
    srcs = re.findall(r'<script src="([^"]+)"></script>', block)
    scripts = []
    for src in srcs:
        path = os.path.join(ROOT, src)
        if not os.path.exists(path):
            print('skip missing', src, file=sys.stderr)
            continue
        code = read(src)
        if '</script' in code.lower():
            raise SystemExit(f'{src} contains a closing script tag; escape it before bundling')
        scripts.append(f'<script>/* {src} */\n{code}\n</script>')
    css = read('src/style.css')
    title = re.search(r'<title>(.*?)</title>', index).group(1)
    body = re.search(r'<body>(.*?)<!--SCRIPTS-->', index, re.S).group(1).strip()
    scripts_html = '\n'.join(scripts)

    standalone = (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        f'<title>{title}</title>\n<style>\n{css}\n</style>\n</head>\n<body>\n{body}\n{scripts_html}\n</body>\n</html>\n'
    )
    artifact = f'<title>{title}</title>\n<style>\n{css}\n</style>\n{body}\n{scripts_html}\n'

    os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)
    for name, text in (('psych.html', standalone), ('artifact.html', artifact)):
        out = os.path.join(ROOT, 'dist', name)
        with open(out, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'wrote dist/{name}  ({len(text.encode("utf-8")) / 1024:.0f} KB, {len(scripts)} scripts)')


if __name__ == '__main__':
    main()
