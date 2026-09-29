"""Seed 3 creators with PLANTED patterns so the demo has something to learn.
Usage: python seed.py            (also writes to Hindsight, slow: 1 LLM extraction per reel)
       python seed.py --no-memory (Supabase only)"""
import sys, random, time
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
load_dotenv()
import db, memory

random.seed(7)
NO_MEM = "--no-memory" in sys.argv
CREATORS = {
    "creator_a": ("Hyderabad Homes", "2BHK/3BHK launches", {"question": 0.055, "walkthrough": 0.03, "price_reveal": 0.009}),
    "creator_b": ("Luxury Villas HYD", "villas & gated communities", {"price_reveal": 0.06, "before_after": 0.03, "question": 0.008}),
    "creator_c": ("Budget Flats HYD", "under-50L flats", {"before_after": 0.05, "myth_bust": 0.035, "walkthrough": 0.01}),
}
TOPICS = ["Kokapet 3BHK", "Gachibowli 2BHK", "Financial District villa", "Miyapur budget flat", "Tellapur gated community"]
CAPS = ["telugu_short", "english_long", "hinglish_cta"]

# Clean tables to ensure exact 1:1 count with Hindsight
db.sb().table("reels").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
db.sb().table("pattern_scores").delete().neq("creator_id", "").execute()

db.sb().table("creators").upsert([{"id": k, "name": v[0], "niche": v[1]} for k, v in CREATORS.items()]).execute()
db.sb().table("creators").upsert([{"id": "client_new", "name": "New Client (live demo)", "niche": "real estate"}]).execute()
now = datetime.now(timezone.utc)

retained_counts = {cid: 0 for cid in CREATORS}

for cid, (_, _, rates) in CREATORS.items():
    if not NO_MEM:
        try:
            memory.client().delete_bank(memory.bank(cid))
        except Exception:
            pass
        memory.ensure_bank(cid)

    hooks = list(rates)
    for i in range(18):
        hook = hooks[i % len(hooks)]
        views = random.randint(3000, 15000)
        saves = int(views * rates[hook] * random.uniform(0.8, 1.2))
        shares = int(views * random.uniform(0.008, 0.02))
        r = db.insert_reel({
            "creator_id": cid, "hook_type": hook, "topic": random.choice(TOPICS),
            "length_sec": random.choice([12, 15, 22, 30]), "caption_style": random.choice(CAPS),
            "post_hour": random.choice([9, 13, 18, 21]), "views": views, "saves": saves, "shares": shares,
            "posted_at": (now - timedelta(days=(18 - i) * 1.5)).isoformat()})
        if not NO_MEM:
            ok = memory.remember(cid, memory.reel_sentence(r))
            if ok:
                retained_counts[cid] += 1
            else:
                print(f"FAILED to retain reel {i+1} for {cid}")
            time.sleep(0.5)
    print("seeded", cid, f"(retained: {retained_counts[cid]}/18)")

print("\n=== SEED SUMMARY ===")
sb_a = len(db.reels("creator_a"))
mem_a = retained_counts["creator_a"]
print(f"Supabase reels for creator_a: {sb_a}")
print(f"Hindsight retained for creator_a: {mem_a}")
if not NO_MEM and sb_a != mem_a:
    print(f"WARNING: Count mismatch! Supabase={sb_a}, Hindsight={mem_a}")

