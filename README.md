# OrthoCare — strona kliniki (GitHub Pages)

Statyczna strona Kliniki OrthoCare w Radomiu. Publikacja przez folder `docs/` na GitHub Pages z domeną `ortopedawradomiu.pl`.

## Struktura projektu

```
src/                 # Źródła (edytuj tutaj)
  sections/          # Fragmenty HTML podstron (cennik, zabiegi, o nas…)
  css/               # theme.css, legacy.css
  js/main.js
  assets/            # Zdjęcia, logo, PDF
docs/                # Wersja produkcyjna (generowana — nie edytuj ręcznie)
scripts/
  build_pages.py     # Składa HTML z sekcji
  publish.sh         # Kopiuje src/ → docs/
  build.sh           # build_pages + publish
  optimize_images.sh # Kompresja zdjęć (macOS, sips)
  clean_accordion_sections.py
CNAME                # Domena GitHub Pages
```

## Wymagania

- Python 3
- Node.js 18+ i npm (tylko do Tailwind na podstronach z `dist/output.css`)

## Instalacja

```bash
npm install
```

## Edycja i podgląd lokalny

1. Edytuj pliki w `src/sections/` lub `src/css/`.
2. Zbuduj strony:

```bash
bash scripts/build.sh
```

3. Podgląd lokalny:

```bash
npm start
# http://127.0.0.1:3000
```

## Publikacja na GitHub

1. Upewnij się, że repozytorium ma ustawione **GitHub Pages → Deploy from branch → main → /docs**.
2. Zbuduj i opublikuj:

```bash
bash scripts/build.sh
```

3. Commit i push:

```bash
git add -A
git commit -m "Opis zmian"
git push origin main
```

Jeśli repozytorium nie ma jeszcze remote:

```bash
git remote add origin https://github.com/TWOJ-USER/orthocare2.git
git push -u origin main
```

Po pushu GitHub Pages wdroży zawartość `docs/` (zwykle w ciągu 1–3 minut).

## Skróty npm

| Polecenie | Opis |
|-----------|------|
| `npm run build` | Tailwind CSS → `src/dist/output.css` |
| `npm run watch` | Tailwind w trybie watch |
| `npm start` | Serwer lokalny (`src/`) |
| `npm run publish` | `publish.sh` (src → docs) |

## Domena

Plik `CNAME` wskazuje `ortopedawradomiu.pl`. DNS musi wskazywać na GitHub Pages (rekordy A/CNAME u dostawcy domeny).
