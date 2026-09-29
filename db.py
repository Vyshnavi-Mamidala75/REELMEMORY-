import os
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime, timedelta, timezone
from supabase import create_client

HOOKS = ["question", "price_reveal", "walkthrough", "before_after", "myth_bust"]
_sb = None

def sb():
    global _sb
    if _sb is None:
        _sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])
    return _sb

def save_rate(r):
    return r["saves"] / max(r["views"], 1)

def reward(views, saves, shares):
    """0..1. Saves count 1x, shares 2x; 8% weighted-engagement = 1.0"""
    return min(1.0, ((saves + 2 * shares) / max(views, 1)) / 0.08)

def update_score(creator_id, hook, rw, alpha=0.35):
    cur = sb().table("pattern_scores").select("*").eq("creator_id", creator_id).eq("hook_type", hook).execute().data
    old, n = (cur[0]["score"], cur[0]["n"]) if cur else (0.5, 0)
    new = round((1 - alpha) * old + alpha * rw, 4)   # EMA: recent reels weigh more
    sb().table("pattern_scores").upsert({
        "creator_id": creator_id, "hook_type": hook, "score": new, "n": n + 1,
        "updated_at": datetime.now(timezone.utc).isoformat()}).execute()
    return new

def insert_reel(r):
    row = sb().table("reels").insert(r).execute().data[0]
    update_score(r["creator_id"], r["hook_type"], reward(r["views"], r["saves"], r["shares"]))
    return row

def reels(creator_id):
    return sb().table("reels").select("*").eq("creator_id", creator_id).order("posted_at").execute().data

def scores(creator_id):
    return sb().table("pattern_scores").select("*").eq("creator_id", creator_id).order("score", desc=True).execute().data

def analytics(creator_id, days=30):
    if not days or days <= 0:
        rows = sb().table("reels").select("*").eq("creator_id", creator_id).order("posted_at").execute().data
    else:
        since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        rows = sb().table("reels").select("*").eq("creator_id", creator_id).gte("posted_at", since).order("posted_at").execute().data
    if not rows:
        return {"days": days or "all", "reels": 0}
    best = max(rows, key=save_rate)
    return {"days": days or "all", "reels": len(rows),
            "views": sum(r["views"] for r in rows), "saves": sum(r["saves"] for r in rows),
            "shares": sum(r["shares"] for r in rows),
            "best_reel": {"topic": best.get("topic"), "hook_type": best["hook_type"],
                          "views": best["views"], "save_rate": round(save_rate(best), 4)}}

def compare_last_two(creator_id):
    rows = reels(creator_id)[-2:]
    if len(rows) < 2:
        return {"error": "need at least 2 reels"}
    a, b = rows
    changed = {k: [a.get(k), b.get(k)] for k in ("hook_type", "length_sec", "caption_style", "post_hour", "topic") if a.get(k) != b.get(k)}
    return {"previous": a, "latest": b, "changed": changed,
            "views_change_pct": round((b["views"] - a["views"]) / max(a["views"], 1) * 100, 1),
            "save_rate_before": round(save_rate(a), 4), "save_rate_after": round(save_rate(b), 4)}

def why_line(creator_id, hook):
    """Deterministic, computed from real numbers. The LLM never invents this."""
    allr = reels(creator_id)
    mine = [r for r in allr if r["hook_type"] == hook][-5:]
    if not allr or not mine:
        return None
    rates = sorted(save_rate(r) for r in allr)
    med = rates[len(rates) // 2]
    beat = sum(1 for r in mine if save_rate(r) > med)
    avg = sum(save_rate(r) for r in mine) / len(mine)
    return f"{hook} hook: {beat} of last {len(mine)} reels beat your median save rate ({med:.1%}); average {avg:.1%}."
