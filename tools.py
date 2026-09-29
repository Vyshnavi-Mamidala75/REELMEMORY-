import json, re
import db, memory
from llm import complete, parse_json

HOOKS = db.HOOKS

def clean_editorial_text(text, max_paragraphs=3):
    if not text:
        return ""
    # Strip markdown headers, table bars, and list bullets
    lines = []
    for line in text.splitlines():
        line = re.sub(r"^#+\s*", "", line)
        line = re.sub(r"^[\*\-\+]\s+", "", line)
        line = re.sub(r"^\d+\.\s+", "", line)
        line = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
        if line.strip().startswith("|"):
            continue
        if "data limitation" in line.lower() and len(line) < 30:
            continue
        lines.append(line)
    cleaned = "\n".join(lines)
    # Split into paragraphs and filter empty or short header leftovers
    paragraphs = [p.strip() for p in cleaned.split("\n\n") if len(p.strip()) > 40]
    return "\n\n".join(paragraphs[:max_paragraphs])

def make_plan(creator_id, brief, use_memory=True):
    system = (
        "You plan Instagram reels for real-estate creators. Output ONLY a JSON object with keys: "
        f"hook_type (one of {HOOKS}), length_sec, caption_style, post_hour (0-23), caption_idea, reasoning. "
        "Rules: Never invent statistics. This is an Instagram Reel: never say 'swipe' or 'swipe up' (those are for carousels); "
        "use 'watch till the end' or 'save this reel' instead. Keep captions to 1-2 focused lines. "
        "If timing, length or caption style data is missing in memory, state that honestly instead of guessing."
    )
    insight = ""
    recalled_mems = []
    if use_memory:
        raw_insight = memory.reflect_text(
            creator_id,
            "Based on this client's past reels, in at most 3 short paragraphs of plain text (no markdown headers, no bullets), "
            f"summarize which hook types and formats work and which fail, then advise on this brief: {brief}"
        )
        insight = clean_editorial_text(raw_insight, max_paragraphs=3)
        recalled_mems = memory.recall_texts(creator_id, brief, limit=4)
        sc = db.scores(creator_id)
        ctx = (f"Brief: {brief}\n\nWhat memory says about this client (Hindsight):\n{insight or 'nothing yet'}\n\n"
               f"Supporting pattern scores (0-1, higher = better for THIS client):\n{json.dumps(sc, default=str)}\n\n"
               "Base your plan on the memory insight. If memory has nothing, say so and keep the plan generic.")
    else:
        ctx = f"Brief: {brief}\n\nYou have NO history about this creator. Give a generic plan."
    
    out = parse_json(complete([{"role": "system", "content": system}, {"role": "user", "content": ctx}]).choices[0].message.content)
    plan = {
        "hook_type": out.get("hook_type"),
        "length_sec": out.get("length_sec"),
        "caption_style": out.get("caption_style"),
        "post_hour": out.get("post_hour"),
        "caption_idea": out.get("caption_idea"),
        "reasoning": out.get("reasoning"),
        "memory_used": use_memory,
        "memory_insight": insight,
        "sources": {
            "reels": db.reels(creator_id)[-5:],
            "pattern_scores": db.scores(creator_id)[:3],
            "recalled_memories": recalled_mems
        }
    }
    if use_memory and plan["hook_type"]:
        plan["why"] = db.why_line(creator_id, plan["hook_type"])   # computed from real numbers
    plan["plan"] = format_plan_text(plan)
    return plan

def log_reel(creator_id, **a):
    row = db.insert_reel({
        "creator_id": creator_id, "hook_type": a["hook_type"], "topic": a.get("topic"),
        "length_sec": a.get("length_sec"), "caption_style": a.get("caption_style"),
        "post_hour": a.get("post_hour"), "views": a["views"], "saves": a["saves"], "shares": a["shares"]})
    sentence = memory.reel_sentence(row)
    memory.remember(creator_id, sentence)
    top = db.scores(creator_id)[:3]
    return {
        "logged": True,
        "new_scores_top3": top,
        "sources": {
            "reels": [row],
            "pattern_scores": top,
            "recalled_memories": [sentence]
        }
    }

def get_analytics(creator_id, days=1):
    data = db.analytics(creator_id, days)
    data["sources"] = {
        "reels": db.reels(creator_id)[-5:],
        "pattern_scores": db.scores(creator_id)[:3],
        "recalled_memories": []
    }
    return data

def compare_reels(creator_id):
    data = db.compare_last_two(creator_id)
    data["sources"] = {
        "reels": [data.get("previous"), data.get("latest")] if "previous" in data else [],
        "pattern_scores": db.scores(creator_id)[:3],
        "recalled_memories": []
    }
    return data

def query_memory(creator_id, query):
    """Answer questions about what has been learned about this creator using Hindsight reflect and recall."""
    raw_reflect = memory.reflect_text(
        creator_id,
        f"Answer this question about the creator's reel performance based strictly on memory: {query}. "
        "Answer in at most 3 short, calm, editorial paragraphs without markdown headers or bullet points."
    )
    cleaned = clean_editorial_text(raw_reflect, max_paragraphs=3)
    recalls = memory.recall_texts(creator_id, query, limit=5)
    all_reels = db.reels(creator_id)
    top_scores = db.scores(creator_id)[:3]
    return {
        "insight": cleaned,
        "recalled_memories": recalls,
        "sources": {
            "reels": all_reels[-5:],
            "pattern_scores": top_scores,
            "recalled_memories": recalls
        }
    }

def format_plan_text(p):
    if not isinstance(p, dict):
        return str(p)
    lines = []
    if p.get("hook_type"):
        lines.append(f"Hook: {p['hook_type'].replace('_', ' ').title()}")
    if p.get("length_sec"):
        lines.append(f"Length: {p['length_sec']}s")
    if p.get("caption_style"):
        lines.append(f"Caption style: {p['caption_style'].replace('_', ' ').title()}")
    if p.get("post_hour") is not None:
        lines.append(f"Posting time: {p['post_hour']:02d}:00")
    if p.get("caption_idea"):
        lines.append(f"Caption idea: {p['caption_idea']}")
    if p.get("reasoning"):
        lines.append(f"Reasoning: {p['reasoning']}")
    return "\n\n".join(lines) if lines else json.dumps(p)

def plan_next_reel(creator_id, brief):
    return make_plan(creator_id, brief, use_memory=True)

def compare_memory(creator_id, brief):
    without_m = make_plan(creator_id, brief, False)
    with_m = make_plan(creator_id, brief, True)
    return {
        "without_memory": format_plan_text(without_m),
        "with_memory": format_plan_text(with_m),
        "without_memory_plan": without_m,
        "with_memory_plan": with_m,
        "memory_insight": with_m.get("memory_insight") or "No specific memory insight recorded.",
        "why": with_m.get("why") or "Baseline comparison across client past reels.",
        "sources": with_m.get("sources", {})
    }

REGISTRY = {
    "log_reel": log_reel,
    "get_analytics": get_analytics,
    "compare_reels": compare_reels,
    "plan_next_reel": plan_next_reel,
    "compare_memory": compare_memory,
    "query_memory": query_memory
}

def _fn(name, desc, props, req):
    return {"type": "function", "function": {"name": name, "description": desc,
            "parameters": {"type": "object", "properties": props, "required": req}}}

TOOL_SCHEMAS = [
    _fn("log_reel", "Save a reel and its results. Call when the user reports a reel's stats.",
        {"hook_type": {"type": "string", "enum": HOOKS}, "topic": {"type": "string"},
         "length_sec": {"type": "integer"}, "caption_style": {"type": "string"},
         "post_hour": {"type": "integer"}, "views": {"type": "integer"},
         "saves": {"type": "integer"}, "shares": {"type": "integer"}},
        ["hook_type", "views", "saves", "shares"]),
    _fn("get_analytics", "Totals and best reel for the last N days (default 1 = today).",
        {"days": {"type": "integer"}}, []),
    _fn("compare_reels", "Compare the previous reel vs the latest reel: what changed and how results moved.", {}, []),
    _fn("plan_next_reel", "Plan the next reel using this creator's memory and pattern scores.",
        {"brief": {"type": "string"}}, ["brief"]),
    _fn("compare_memory", "Show the same brief planned WITHOUT memory vs WITH memory, side by side.",
        {"brief": {"type": "string"}}, ["brief"]),
    _fn("query_memory", "Ask what has been learned about this client's audience, hooks, or patterns from Hindsight memory.",
        {"query": {"type": "string"}}, ["query"]),
]

