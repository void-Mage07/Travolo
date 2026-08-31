#!/usr/bin/env python3
"""
Build a licensed Amer Fort image dataset from Wikimedia Commons.

This script uses the public MediaWiki API. It downloads only files from
the selected Wikimedia Commons categories, records the source/author/license,
and skips obvious information-plate files.

Install:
    pip install requests pillow tqdm

Run:
    python build_amer_fort_dataset.py

Output:
    amer_fort_dataset/
      ganesh_pol/
      jaleb_chowk/
      sheesh_mahal/
      diwan_e_aam/
      diwan_e_khas/
      sukh_niwas/
      zenana/
      suraj_pol/
      metadata.csv

IMPORTANT:
- Wikimedia Commons licenses are file-specific. Always review metadata.csv
  before redistributing the dataset.
- This is a dataset collector, not a guarantee that every image is suitable
  for training. Manually inspect ambiguous images before training.
- It downloads at most MAX_PER_CLASS files per category. Change the value
  if you want more.
"""

import csv
import hashlib
import re
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from PIL import Image
from io import BytesIO
from tqdm import tqdm

API = "https://commons.wikimedia.org/w/api.php"
OUT = Path("amer_fort_dataset")
MAX_PER_CLASS = 100
SLEEP = 0.15

# Dedicated categories. For Zenana, the broader Man Singh Palace category
# is used because Commons does not provide a clean 100-image Zenana category.
CATEGORIES = {
    "ganesh_pol": "Category:Ganesh Pol (Amber Fort)",
    "jaleb_chowk": "Category:Jaleb Chowk (Amber Fort)",
    "sheesh_mahal": "Category:Sheesh Mahal (Amber Fort)",
    "diwan_e_aam": "Category:Diwan-i Am (Amber Fort)",
    "diwan_e_khas": "Category:Diwan-i Khas (Amber Fort)",
    "sukh_niwas": "Category:Sukh Niwas (Amber Fort)",
    "zenana": "Category:Man Singh Palace (Amber Fort)",
    "suraj_pol": "Category:Suraj Pol (Amber Fort)",
}

# Obvious non-training images. Keep this conservative.
SKIP_WORDS = [
    "information plate",
    "information sign",
    "map",
    "plan",
    "diagram",
    "logo",
    "flag",
    "ticket",
]

session = requests.Session()
session.headers.update({
    "User-Agent": "Travolo-AmerFortDatasetBuilder/1.0 "
                  "(educational hackathon dataset collection)"
})


def api(params):
    params = dict(params)
    params["format"] = "json"
    r = session.get(API, params=params, timeout=30)
    r.raise_for_status()
    return r.json()


def get_category_files(category, limit=100):
    """Return image file titles from a Commons category."""
    titles = []
    cmcontinue = None

    while len(titles) < limit:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": category,
            "cmnamespace": 6,  # File namespace
            "cmlimit": "max",
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue

        data = api(params)
        for item in data["query"]["categorymembers"]:
            title = item["title"]
            low = title.lower()
            if any(word in low for word in SKIP_WORDS):
                continue
            if re.search(r"\.(jpg|jpeg|png|webp|tif|tiff)$", low):
                titles.append(title)
                if len(titles) >= limit:
                    break

        if "continue" not in data:
            break
        cmcontinue = data["continue"]["cmcontinue"]
        time.sleep(SLEEP)

    return titles


def get_file_metadata(titles):
    """Fetch image URL and licensing metadata for a batch of titles."""
    data = api({
        "action": "query",
        "titles": "|".join(titles),
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
        "iiurlwidth": 1600,
    })

    results = []
    for page in data["query"]["pages"].values():
        if "imageinfo" not in page:
            continue

        info = page["imageinfo"][0]
        meta = info.get("extmetadata", {})

        def value(key):
            return meta.get(key, {}).get("value", "").strip()

        results.append({
            "title": page["title"],
            "url": info.get("thumburl") or info.get("url"),
            "original_url": info.get("descriptionurl", ""),
            "mime": info.get("mime", ""),
            "author": value("Artist"),
            "license": value("LicenseShortName"),
            "license_url": value("LicenseUrl"),
            "description": value("ImageDescription"),
            "source": "Wikimedia Commons",
        })

    return results


def safe_name(title, index):
    name = title.split(":", 1)[-1]
    name = re.sub(r"[^\w.\- ]+", "", name, flags=re.UNICODE)
    name = name.replace(" ", "_")
    if not name:
        name = f"image_{index:04d}.jpg"
    return name[:180]


def download_image(url):
    r = session.get(url, timeout=60)
    r.raise_for_status()
    img = Image.open(BytesIO(r.content))
    img.verify()

    # Re-open after verify, then normalize to RGB JPEG.
    img = Image.open(BytesIO(r.content)).convert("RGB")
    return img


def main():
    OUT.mkdir(exist_ok=True)
    rows = []

    print("\nTravolo Amer Fort dataset builder")
    print("Source: Wikimedia Commons")
    print(f"Maximum: {MAX_PER_CLASS} images/class\n")

    for class_name, category in CATEGORIES.items():
        folder = OUT / class_name
        folder.mkdir(parents=True, exist_ok=True)

        print(f"\n[{class_name}] {category}")
        titles = get_category_files(category, MAX_PER_CLASS)

        if not titles:
            print("  No files found.")
            continue

        # API batches are safer than one huge request.
        metadata = []
        for i in range(0, len(titles), 50):
            metadata.extend(get_file_metadata(titles[i:i + 50]))
            time.sleep(SLEEP)

        seen_hashes = set()
        saved = 0

        for i, item in enumerate(tqdm(metadata, desc=class_name), start=1):
            try:
                if not item["url"]:
                    continue

                img = download_image(item["url"])

                # Deduplicate exact downloaded pixels.
                raw = img.tobytes()
                digest = hashlib.sha256(raw).hexdigest()
                if digest in seen_hashes:
                    continue
                seen_hashes.add(digest)

                filename = safe_name(item["title"], saved + 1)
                if not filename.lower().endswith(".jpg"):
                    filename = Path(filename).stem + ".jpg"

                path = folder / filename
                img.save(path, "JPEG", quality=92)

                rows.append({
                    "filename": str(path.relative_to(OUT)).replace("\\", "/"),
                    "class": class_name,
                    "source": item["source"],
                    "author": item["author"],
                    "license": item["license"],
                    "license_url": item["license_url"],
                    "source_url": item["original_url"],
                    "commons_title": item["title"],
                    "description": item["description"],
                })
                saved += 1

            except Exception as exc:
                print(f"  skipped {item.get('title', '')}: {exc}")

            time.sleep(SLEEP)

        print(f"  Saved {saved} images.")

    metadata_file = OUT / "metadata.csv"
    fields = [
        "filename", "class", "source", "author", "license",
        "license_url", "source_url", "commons_title", "description"
    ]

    with metadata_file.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print("\nDONE!")
    print(f"Dataset: {OUT.resolve()}")
    print(f"Metadata: {metadata_file.resolve()}")
    print(f"Total images: {len(rows)}")
    print("\nNext step: manually inspect the folders and remove irrelevant/")
    print("ambiguous images before training ResNet.")


if __name__ == "__main__":
    main()
