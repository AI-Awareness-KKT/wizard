"""Copy the static game into dist/ for preview or static hosting."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
dist.mkdir(exist_ok=True)
shutil.copy2(root / 'index.html', dist / 'index.html')
shutil.copytree(root / 'assets', dist / 'assets', dirs_exist_ok=True)
print('Built dist/')
