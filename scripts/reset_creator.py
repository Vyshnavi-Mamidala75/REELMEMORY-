import sys
import os

# Add parent directory to path so we can import db and memory
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()
import db
import memory

SEEDED_CREATORS = {"creator_a", "creator_b", "creator_c"}

def main():
    args = [a for a in sys.argv[1:] if a != "--yes"]
    has_yes = "--yes" in sys.argv

    if not args:
        print("Usage: python scripts/reset_creator.py <creator_id> [--yes]")
        sys.exit(1)

    creator_id = args[0]

    # Safety Rule 1: Refuse any seeded demo creator
    if creator_id in SEEDED_CREATORS:
        print(f"Error: Refusing to reset seeded demo creator '{creator_id}'. Seeded demo creators cannot be reset.")
        sys.exit(1)

    # Safety Rule 2: Refuse unless id starts with client_new or test_
    if not (creator_id.startswith("client_new") or creator_id.startswith("test_")):
        print(f"Error: Refusing to run on creator '{creator_id}'. ID must start with 'client_new' or 'test_'.")
        sys.exit(1)

    # Count current data
    try:
        current_reels = len(db.reels(creator_id))
        current_scores = len(db.scores(creator_id))
    except Exception as e:
        current_reels = 0
        current_scores = 0

    # Safety Rule 3: Require --yes flag
    if not has_yes:
        print(f"DRY RUN: Resetting '{creator_id}' would delete {current_reels} reel(s) and {current_scores} pattern score(s) in Supabase, and recreate Hindsight bank '{memory.bank(creator_id)}'.")
        print("Re-run with --yes to execute.")
        sys.exit(0)

    # Execute deletion in Supabase
    db.sb().table("reels").delete().eq("creator_id", creator_id).execute()
    db.sb().table("pattern_scores").delete().eq("creator_id", creator_id).execute()

    # Recreate bank in Hindsight (delete is fully supported)
    bank_id = memory.bank(creator_id)
    try:
        memory.client().delete_bank(bank_id=bank_id)
    except Exception:
        pass

    try:
        memory.client().create_bank(bank_id=bank_id)
    except Exception as e:
        print(f"Notice: Bank creation returned: {e}")

    # Report resulting status numbers
    sb_reels = len(db.reels(creator_id))
    try:
        m = memory.client().list_memories(bank_id=bank_id)
        m_count = getattr(m, "total", len(getattr(m, "items", [])))
        status_info = {
            "status": "connected",
            "bank_id": bank_id,
            "supabase_reels": sb_reels,
            "memory_units": m_count,
            "lag": max(0, sb_reels - m_count)
        }
    except Exception as e:
        status_info = {
            "status": "offline",
            "bank_id": bank_id,
            "supabase_reels": sb_reels,
            "error": str(e)
        }

    print("Reset complete. Resulting status:")
    import json
    print(json.dumps(status_info, indent=2))

if __name__ == "__main__":
    main()
