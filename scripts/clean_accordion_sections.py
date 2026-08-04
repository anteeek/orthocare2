#!/usr/bin/env python3
"""Normalize accordion markup in cennik and zabiegi section partials."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECTIONS = ROOT / "src" / "sections"

CHEVRON = (
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" '
    'd="M19 9l-7 7-7-7"></path>'
)


def chevron(icon_id: str) -> str:
    return (
        f'<svg class="service-header__chevron" id="icon-{icon_id}" '
        f'fill="none" stroke="currentColor" viewBox="0 0 24 24">{CHEVRON}</svg>'
    )


def strip_tag(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html).strip()


def clean_paragraphs(html: str) -> str:
    html = re.sub(
        r'<p class="text-brand-body leading-relaxed mb-4">',
        "<p>",
        html,
    )
    html = re.sub(
        r'<p class="text-brand-body leading-relaxed">',
        "<p>",
        html,
    )
    return html


def fix_priced_button(match: re.Match[str]) -> str:
    service_id = match.group(1)
    full = match.group(0)
    inner_match = re.search(r">(.*)</button>", full, re.DOTALL)
    inner = inner_match.group(1) if inner_match else ""

    title_match = re.search(r"<h3[^>]*>(.*?)</h3>", inner, re.DOTALL)
    title = strip_tag(title_match.group(1)) if title_match else ""

    note_match = re.search(
        r'<p class="text-sm text-brand-muted mt-1">(.*?)</p>',
        inner,
        re.DOTALL,
    )
    note_html = ""
    if note_match:
        note_html = f'\n          <p class="service-header__note">{strip_tag(note_match.group(1))}</p>'

    price_match = re.search(
        r'<span class="text-2xl font-bold text-brand mr-4">(.*?)</span>',
        inner,
        re.DOTALL,
    )
    price = strip_tag(price_match.group(1)) if price_match else ""

    return f"""      <button class="service-header service-header--priced" onclick="toggleService('{service_id}')">
        <div class="service-header__main">
          <h3>{title}</h3>{note_html}
        </div>
        <div class="service-header__meta">
          <span class="service-header__price">{price}</span>
          {chevron(service_id)}
        </div>
      </button>"""

def clean_cennik(html: str) -> str:
    html = html.replace(
        '<section class="max-w-4xl mx-auto px-4 sm:px-6">',
        '<section class="accordion-page">',
    )
    html = html.replace('<div class="space-y-4">', '<div class="service-list">')
    html = re.sub(
        r'<div class="service-item bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">',
        '<div class="service-item">',
        html,
    )
    html = re.sub(
        r'<button class="service-header w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200" onclick="toggleService\(\'([^\']+)\'\)">.*?</button>',
        fix_priced_button,
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'class="service-content hidden px-6 pb-6"',
        'class="service-content hidden"',
        html,
    )
    html = re.sub(
        r'<div class="border-t border-gray-100 pt-6">',
        '<div class="service-content__body">',
        html,
    )
    html = clean_paragraphs(html)

    html = html.replace(
        """        <div class="info-panel-full">
          <div class="bg-brand-light p-8">
            <h3 class="text-2xl font-semibold text-brand-dark mb-4">Ważne informacje</h3>
            <div class="space-y-4 text-left">
              <div>
                <h4 class="font-semibold text-brand-dark mb-3 text-lg">Dodatkowe informacje:</h4>
                <ul class="text-brand-body space-y-2 text-sm leading-relaxed">""",
        """  <div class="info-panel">
    <div class="info-panel__inner">
      <h3 class="info-panel__title">Ważne informacje</h3>
      <ul class="info-panel__list">""",
    )
    html = html.replace(
        """                </ul>
              </div>
            </div>
          </div>
        </div>

</section>""",
        """      </ul>
    </div>
  </div>
</section>""",
    )

    html = re.sub(r"\n{3,}", "\n\n", html)
    return html.lstrip("\n")


def fix_zabiegi_button(match: re.Match[str]) -> str:
    service_id = match.group(1)
    full = match.group(0)
    inner_match = re.search(r">(.*)</button>", full, re.DOTALL)
    inner = inner_match.group(1) if inner_match else ""
    title_match = re.search(r"<h3[^>]*>(.*?)</h3>", inner, re.DOTALL)
    title = strip_tag(title_match.group(1)) if title_match else ""
    return f"""      <button class="service-header" onclick="toggleService('{service_id}')">
        <h3>{title}</h3>
        {chevron(service_id)}
      </button>"""


def clean_zabiegi(html: str) -> str:
    html = html.replace(
        '<section class="max-w-4xl mx-auto px-4 sm:px-6">',
        '<section class="accordion-page">',
    )
    html = re.sub(
        r'<div class="space-y-3" id="procedures-list">',
        '<div class="service-list" id="procedures-list">',
        html,
    )
    html = re.sub(
        r'<div class="service-item bg-white border border-gray-200 rounded-2xl shadow-sm">',
        '<div class="service-item">',
        html,
    )
    html = re.sub(
        r'<button class="service-header w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition" onclick="toggleService\(\'([^\']+)\'\)">.*?</button>',
        fix_zabiegi_button,
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'class="service-content hidden px-6 pb-6"',
        'class="service-content hidden"',
        html,
    )
    html = re.sub(
        r'<p class="text-brand-body leading-relaxed border-t border-gray-100 pt-4">',
        '<div class="service-content__body"><p>',
        html,
    )
    html = re.sub(
        r"(</p></div>\s*</div>\s*</div>)",
        r"</p></div></div>",
        html,
    )
    html = clean_paragraphs(html)

    html = html.replace(
        """      <div class="info-panel-full">
        <div class="bg-brand-light p-8">
          <h3 class="text-2xl font-semibold text-brand-dark mb-4">Ważne informacje</h3>
          <ul class="text-brand-body space-y-2 text-sm leading-relaxed">""",
        """  <div class="info-panel">
    <div class="info-panel__inner">
      <h3 class="info-panel__title">Ważne informacje</h3>
      <ul class="info-panel__list">""",
    )
    html = html.replace(
        """          </ul>
        </div>
      </div>
    </section>""",
        """      </ul>
    </div>
  </div>
</section>""",
    )

    html = re.sub(r"\n{3,}", "\n\n", html)
    return html.lstrip("\n")


def normalize_cennik(html: str) -> str:
    html = html.replace(
        '<section class="accordion-page">\n        <div class="service-list">',
        '<section class="accordion-page">\n  <div class="service-list">',
    )
    html = re.sub(
        r"          <!-- (.+?) -->\n          <div class=\"service-item\">\n                  <button",
        r'    <!-- \1 -->\n    <div class="service-item">\n      <button',
        html,
    )
    html = re.sub(
        r'            <div id="(content-[^"]+)" class="service-content hidden">',
        r'      <div id="\1" class="service-content hidden">',
        html,
    )
    html = re.sub(
        r'              <div class="service-content__body">',
        r'        <div class="service-content__body">',
        html,
    )
    html = re.sub(
        r"                <p>",
        r"          <p>",
        html,
    )
    html = re.sub(
        r"                </p>",
        r"          </p>",
        html,
    )
    html = re.sub(
        r"              </div>\n            </div>\n          </div>",
        r"        </div>\n      </div>\n    </div>",
        html,
    )
    html = re.sub(
        r'<div id="(content-[^"]+)" class="service-content hidden"><div class="service-content__body">',
        r'<div id="\1" class="service-content hidden">\n        <div class="service-content__body">',
        html,
    )
    html = re.sub(
        r"</div></div>\n          </div>",
        r"        </div>\n      </div>\n    </div>",
        html,
    )
    html = html.replace(
        "        </div>\n\n        <!-- Additional Information -->",
        "  </div>\n\n  <!-- Additional Information -->",
    )
    html = re.sub(r"                  <li>", r"        <li>", html)
    html = re.sub(r"\n{3,}", "\n\n", html)
    return html


def normalize_zabiegi(html: str) -> str:
    html = html.replace(
        '<section class="accordion-page">\n      \n      <div class="service-list"',
        '<section class="accordion-page">\n  <div class="service-list"',
    )
    html = re.sub(
        r'\n        <div class="service-item">\n                <button',
        r'\n    <div class="service-item">\n      <button',
        html,
    )
    html = re.sub(
        r'<div id="(content-[^"]+)" class="service-content hidden"><div class="service-content__body"><p>(.*?)</p></div>\n        </div>',
        r'<div id="\1" class="service-content hidden">\n        <div class="service-content__body">\n          <p>\2</p>\n        </div>\n      </div>\n    </div>',
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r'<div id="(content-[^"]+)" class="service-content hidden"><div class="service-content__body"><p>(.*?)</p></div></div>',
        r'<div id="\1" class="service-content hidden">\n        <div class="service-content__body">\n          <p>\2</p>\n        </div>\n      </div>\n    </div>',
        html,
        flags=re.DOTALL,
    )
    html = html.replace("      </div>\n\n  <div class=\"info-panel\">", "  </div>\n\n  <div class=\"info-panel\">")
    html = re.sub(r"            <li>", r"        <li>", html)
    html = re.sub(r"              <ul", r"          <ul", html)
    html = re.sub(r"                <li>", r"            <li>", html)
    html = re.sub(r"\n{3,}", "\n\n", html)
    return html


def main() -> None:
    cennik_path = SECTIONS / "cennik.html"
    zabiegi_path = SECTIONS / "zabiegi.html"

    cennik_raw = cennik_path.read_text(encoding="utf-8")
    zabiegi_raw = zabiegi_path.read_text(encoding="utf-8")

    if "service-header--priced" not in cennik_raw:
        cennik_raw = clean_cennik(cennik_raw)
    else:
        cennik_raw = normalize_cennik(cennik_raw)

    if 'class="service-header w-full' in zabiegi_raw:
        zabiegi_raw = clean_zabiegi(zabiegi_raw)
    else:
        zabiegi_raw = normalize_zabiegi(zabiegi_raw)

    cennik_path.write_text(cennik_raw, encoding="utf-8")
    zabiegi_path.write_text(zabiegi_raw, encoding="utf-8")
    print("Cleaned:", cennik_path.name, zabiegi_path.name)


if __name__ == "__main__":
    main()
