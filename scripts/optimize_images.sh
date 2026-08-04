#!/bin/sh
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ASSETS="$ROOT/src/assets"

compress() {
  sips -Z "$3" "$1" --out "$2" -s format jpeg -s formatOptions "$4" >/dev/null
}

mkdir -p "$ASSETS/doctors/thumbs" "$ASSETS/doctors/profile" "$ASSETS/gallery/thumbs"

# Homepage hero — standalone banner export (no nav crop)
if [ -f "$ASSETS/hero-banner.png" ]; then
  ASSETS="$ASSETS" python3 - <<'PY'
from pathlib import Path
import os
from PIL import Image
assets = Path(os.environ["ASSETS"])
src = Image.open(assets / "hero-banner.png").convert("RGB")
w, h = src.size
src.save(assets / "hero-desktop.jpg", quality=98, optimize=True, subsampling=0)
src.save(assets / "hero-mobile.jpg", quality=98, optimize=True, subsampling=0)
split_y = 850
photos = src.crop((0, 0, w, split_y))
cols_dir = assets / "hero-cols"
cols_dir.mkdir(parents=True, exist_ok=True)
cols = 5
col_w = w // cols
for i in range(cols):
    left = i * col_w
    right = w if i == cols - 1 else (i + 1) * col_w
    photos.crop((left, 0, right, split_y)).save(cols_dir / f"hero-{i + 1}.jpg", quality=92, optimize=True)
import shutil
for src, dst in ((1, 1), (3, 2), (5, 3)):
    shutil.copy2(cols_dir / f"hero-{src}.jpg", assets / f"hero-{dst}.jpg")
PY
elif [ -f "$ASSETS/hero-master.png" ]; then
  ASSETS="$ASSETS" python3 - <<'PY'
from pathlib import Path
import os
from PIL import Image
assets = Path(os.environ["ASSETS"])
src = Image.open(assets / "hero-master.png").convert("RGB")
w, _ = src.size
target_h = round(w * 443 / 1024)
y = 280
crop = src.crop((0, y, w, y + target_h))
crop.save(assets / "hero-desktop.jpg", quality=95, optimize=True)
crop.save(assets / "hero-mobile.jpg", quality=95, optimize=True)
PY
elif [ -f "$ASSETS/hero-source.png" ]; then
  sips -s format jpeg -s formatOptions 95 "$ASSETS/hero-source.png" --out "$ASSETS/hero-mobile.jpg" >/dev/null
  cp "$ASSETS/hero-mobile.jpg" "$ASSETS/hero-desktop.jpg"
fi
if [ -f "$ASSETS/team-master.jpg" ]; then
  sips -s format jpeg -s formatOptions 92 "$ASSETS/team-master.jpg" --out "$ASSETS/team-photo.jpg" >/dev/null
  ASSETS_PATH="$ASSETS/team-photo.jpg" python3 - <<'PY'
from PIL import Image
from pathlib import Path
import os
path = Path(os.environ["ASSETS_PATH"])
img = Image.open(path).convert("RGB")
w, h = img.size
pixels = img.load()

def is_border(px):
    r, g, b = px
    return r > 200 and g > 200 and b > 200

left = 0
for x in range(w):
    if sum(1 for y in range(h) if is_border(pixels[x, y])) / h < 0.85:
        left = x
        break
right = w - 1
for x in range(w - 1, -1, -1):
    if sum(1 for y in range(h) if is_border(pixels[x, y])) / h < 0.85:
        right = x
        break
img.crop((left, 0, right + 1, h)).save(path, quality=92, optimize=True)
PY
elif [ -f "$ASSETS/alldoctors.jpg" ]; then
  cp "$ASSETS/alldoctors.jpg" "$ASSETS/team-photo.jpg"
fi
if [ -f "$ASSETS/team-photo.jpg" ]; then
  ASSETS_PATH="$ASSETS" python3 - <<'PY'
from PIL import Image
from pathlib import Path
import os

assets = Path(os.environ["ASSETS_PATH"])
src = Image.open(assets / "team-photo.jpg").convert("RGB")
cols_dir = assets / "team-cols"
cols_dir.mkdir(parents=True, exist_ok=True)
w, h = src.size
cols = 8
col_w = w // cols
for i in range(cols):
    left = i * col_w
    right = w if i == cols - 1 else (i + 1) * col_w
    src.crop((left, 0, right, h)).save(cols_dir / f"team-{i + 1}.jpg", quality=92, optimize=True)
PY
fi
compress "$ASSETS/clinic-building.jpg" "$ASSETS/clinic-building.jpg" 1280 76
for step in step-1.jpg step-2.jpg step-3.jpg; do
  [ -f "$ASSETS/$step" ] && compress "$ASSETS/$step" "$ASSETS/$step" 800 76
done

# Kriolezja PNG → JPG
for f in krio-hero.png kriolezja-step-1.png kriolezja-step-2.png kriolezja-step-3.png; do
  [ -f "$ASSETS/$f" ] || continue
  out="$ASSETS/${f%.png}.jpg"
  sips -s format jpeg -s formatOptions 80 "$ASSETS/$f" --out "$out" >/dev/null
  sips -Z 1400 "$out" --out "$out" >/dev/null 2>&1 || true
done

# Gallery — compress originals for lightbox, then small grid thumbs
for f in "$ASSETS/gallery"/*.jpg; do
  [ -f "$f" ] || continue
  compress "$f" "$f" 1280 74
  compress "$f" "$ASSETS/gallery/thumbs/$(basename "$f")" 480 70
done

# Doctor list thumbnails
for f in "$ASSETS/doctors"/*.png; do
  base=$(basename "$f" .png)
  case "$base" in *_tall*|*_talll*) continue ;; esac
  compress "$f" "$ASSETS/doctors/thumbs/${base}.jpg" 192 80
done

# High-quality circular card photos for Lekarze list (from square PNGs)
mkdir -p "$ASSETS/doctors/cards"
ASSETS="$ASSETS" python3 - <<'PY'
from pathlib import Path
import os
from PIL import Image
assets = Path(os.environ["ASSETS"]) / "doctors"
out = assets / "cards"
out.mkdir(parents=True, exist_ok=True)
size = 640
for src in sorted(assets.glob("*.png")):
    base = src.stem
    if "_tall" in base:
        continue
    img = Image.open(src).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, min((h - side) // 2 - side // 20, h - side))
    img = img.crop((left, top, left + side, top + side))
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    img.save(out / f"{base}.jpg", quality=96, optimize=True, subsampling=0)
PY

# Doctor profile photos
for f in "$ASSETS/doctors"/*_tall*.png; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  base=${base%_talll.png}
  base=${base%_tall.png}
  compress "$f" "$ASSETS/doctors/profile/${base}.jpg" 720 78
done

[ -f "$ASSETS/doctors/zagorski-profile.jpg" ] && \
  compress "$ASSETS/doctors/zagorski-profile.jpg" "$ASSETS/doctors/profile/zagorski.jpg" 720 78

[ -f "$ASSETS/doctors/zaorski_talll.png" ] && \
  compress "$ASSETS/doctors/zaorski_talll.png" "$ASSETS/doctors/profile/zaorski.jpg" 720 78

echo "Images optimized."
