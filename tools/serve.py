"""Serve Wizard Duel locally without installing packages."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8095)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
for port in range(args.port, min(args.port + 20, 65536)):
    try:
        server = ThreadingHTTPServer(('127.0.0.1', port), partial(SimpleHTTPRequestHandler, directory=str(root)))
        break
    except OSError as error:
        if error.errno not in {48, 98, 10048}:
            raise
else:
    raise SystemExit('No free port. Try --port 9000.')
print(f'Wizard Duel: http://127.0.0.1:{port}/\nKeep this terminal open. Ctrl+C stops the server.', flush=True)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
