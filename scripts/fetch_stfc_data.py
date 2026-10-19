import urllib.request
import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data")
os.makedirs(DATA_DIR, exist_ok=True)

BASE_DATA_URL = "https://data.stfc.space"
BASE_ASSETS_URL = "https://assets.stfc.space"

def fetch_json(path):
    url = f"{BASE_DATA_URL}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            return json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def main():
    print("1. Fetching version...")
    try:
        ver_req = urllib.request.Request(f"{BASE_DATA_URL}/version.txt", headers={"User-Agent": "Mozilla/5.0"})
        version = urllib.request.urlopen(ver_req, timeout=10).read().decode('utf-8').strip()
        print(f"Current STFC.SPACE version: {version}")
    except Exception as e:
        version = ""
        print("Failed to get version:", e)

    print("2. Fetching translations...")
    officer_names_list = fetch_json(f"/translations/en/officer_names.json?version={version}") or []
    officer_flavor_list = fetch_json(f"/translations/en/officer_flavor_text.json?version={version}") or []
    ship_names_list = fetch_json(f"/translations/en/ships.json?version={version}") or []
    systems_list_trans = fetch_json(f"/translations/en/systems.json?version={version}") or []

    officer_names_map = {item.get("id"): item.get("text") for item in officer_names_list if item.get("key") == "officer_name"}
    officer_flavor_map = {item.get("id"): item.get("text") for item in officer_flavor_list if item.get("id") is not None}
    ship_names_map = {item.get("id"): item.get("text") for item in ship_names_list if item.get("id") is not None}
    system_names_map = {str(item.get("id")): item.get("text") for item in systems_list_trans if item.get("key") == "title" and item.get("id") is not None}

    print("3. Fetching summaries...")
    officers_raw = fetch_json(f"/officer/summary.json?version={version}") or []
    ships_raw = fetch_json(f"/ship/summary.json?version={version}") or []
    systems_raw = fetch_json(f"/system/summary.json?version={version}") or []

    CLASS_MAP = {1: "Command", 2: "Science", 3: "Engineering"}
    RARITY_MAP = {1: "Common", 2: "Uncommon", 3: "Rare", 4: "Epic"}
    FACTION_MAP = {
        2064723306: "Federation", 238627341: "Klingon", 278393849: "Romulan",
        -1: "Neutral", 1: "Federation", 2: "Klingon", 3: "Romulan",
        4: "Augment", 5: "Borg", 6: "Rogue", 7: "Bajoran", 8: "Section 31"
    }

    # Process Officers
    officers_clean = []
    for off in officers_raw:
        loca_id = off.get("loca_id")
        name = officer_names_map.get(loca_id)
        if not name or name.strip() == "" or name.startswith("[PH]"):
            continue
        art_id = off.get("art_id", 0)
        raw_flavor = officer_flavor_map.get(loca_id, "")
        group = "General"
        group_match = re.search(r'GROUP:\s*</color>\s*([^\n\r]+)', raw_flavor, re.IGNORECASE)
        if group_match:
            group = group_match.group(1).strip()
        clean_bio = re.sub(r'<[^>]+>', '', raw_flavor).strip()

        officers_clean.append({
            "id": off.get("id"),
            "art_id": art_id,
            "name": name,
            "class": CLASS_MAP.get(off.get("class"), "Command"),
            "rarity": RARITY_MAP.get(off.get("rarity"), "Common"),
            "faction": FACTION_MAP.get(off.get("faction"), "Independent"),
            "group": group,
            "max_rank": off.get("max_rank", 5),
            "has_captain_ability": bool(off.get("captain_ability")),
            "has_below_decks": bool(off.get("below_decks_ability")),
            "image": f"{BASE_ASSETS_URL}/thumbs/officer/i/{art_id}.png",
            "bio": clean_bio
        })

    rarity_order = {"Epic": 0, "Rare": 1, "Uncommon": 2, "Common": 3}
    officers_clean.sort(key=lambda x: (rarity_order.get(x["rarity"], 4), x["name"]))

    with open(os.path.join(DATA_DIR, "officers.json"), "w", encoding="utf-8") as f:
        json.dump(officers_clean, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(officers_clean)} officers.")

    # Process Ships
    ships_clean = []
    HULL_TYPES = {0: "Survey", 1: "Interceptor", 2: "Explorer", 3: "Battleship", 4: "Defense Platform", 5: "Armada Target"}
    for s in ships_raw:
        loca_id = s.get("loca_id")
        name = ship_names_map.get(loca_id) or f"Ship #{s.get('id')}"
        if name == "MISSING DESCRIPTION" or name.startswith("[PH]"):
            continue
        art_id = s.get("art_id", 0)
        ships_clean.append({
            "id": s.get("id"),
            "name": name,
            "hull_type": HULL_TYPES.get(s.get("hull_type"), "Explorer"),
            "grade": s.get("grade", 1),
            "rarity": s.get("rarity", "Common"),
            "max_tier": s.get("max_tier", 1),
            "max_level": s.get("max_level", 10),
            "blueprints_required": s.get("blueprints_required", 0),
            "image": f"{BASE_ASSETS_URL}/thumbs/ship/i/{art_id}.png"
        })
    ships_clean.sort(key=lambda x: (x["grade"], x["name"]))

    with open(os.path.join(DATA_DIR, "ships.json"), "w", encoding="utf-8") as f:
        json.dump(ships_clean, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(ships_clean)} ships.")

    # Process Systems
    systems_clean = []
    for sys in systems_raw:
        sys_id = str(sys.get("id"))
        sys_name = system_names_map.get(sys_id)
        if not sys_name or sys_name == "." or len(sys_name) < 2:
            continue
        systems_clean.append({
            "id": sys.get("id"),
            "name": sys_name,
            "level": sys.get("level", 0),
            "warp": sys.get("est_warp", 1),
            "coords": [sys.get("coords_x", 0), sys.get("coords_y", 0)],
            "has_mines": sys.get("has_mines", False),
            "has_missions": sys.get("has_missions", False),
            "is_deep_space": sys.get("is_deep_space", False)
        })
    systems_clean.sort(key=lambda x: (x["level"], x["warp"], x["name"]))

    with open(os.path.join(DATA_DIR, "systems.json"), "w", encoding="utf-8") as f:
        json.dump(systems_clean[:500], f, ensure_ascii=False, indent=2)
    print(f"Saved {min(500, len(systems_clean))} systems.")

if __name__ == "__main__":
    main()
