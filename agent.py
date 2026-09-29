import json
from llm import complete
from tools import REGISTRY, TOOL_SCHEMAS

SYSTEM = """You are ReelMemory, the memory-powered assistant for a real-estate content agency. Each chat is about ONE client's Instagram account; you remember what works for that client.

PRODUCT KNOWLEDGE:
- Architecture: Groq (gpt-oss-120b) handles reasoning; Hindsight Cloud stores learnings in isolated banks ('creator-<id>'); Supabase stores numbers (reels, views, saves, shares, pattern scores).
- Pattern Scores: Calculated via Exponential Moving Average (EMA, alpha=0.35) where recent reels weigh more. Reward is based on engagement: saves count 1x, shares count 2x, normalized so 8% weighted engagement equals 1.0 (min(1.0, (saves + 2*shares)/views / 0.08)).
- The 'why' line: Computed deterministically in Python from real Supabase numbers comparing a hook's save rates against the client's median save rate. The LLM never invents statistics.
- Capabilities: Log reels from natural language; show analytics (totals, averages, trends); compare reels; plan next reels grounded in memory; explain what has been learned about a client; compare planning with vs without memory.

BEHAVIOR & TONE RULES:
- Tone: Calm, editorial, confident, concise.
- Strictly NO emoji, NO hype, NO exclamation marks.
- Short answers by default. Use small tables only for direct comparisons.
- Language: Telugu-English mix is accepted and answered naturally.
- For ANY number or analytics, call a tool. Never invent stats.
- When the user reports reel results, call log_reel. If a required field is missing, ask ONE short question.
- For "what have you learned about this client?" or questions about hook patterns or memory, call query_memory.
- For "what should I post next" or planning requests, call plan_next_reel and show the plan plus the 'why' line exactly as returned.
- For general real-estate strategy questions, provide clear advice and explicitly label it as general guidance separate from the client's memory.
- For unsupported requests (screenshot analysis, comment sentiment scraping, automatic Instagram account syncing), state that the automated feature is not available yet and offer manual logging instead.
- If data does not exist or memory is empty, state so honestly and explain what data is needed."""

def chat(creator_id, message, history=None, memory_on=True):
    sys_content = SYSTEM
    if not memory_on:
        sys_content += "\n\nNOTE: Memory is currently toggled OFF by the user. Do not call query_memory; use generic planning."
    
    msgs = [{"role": "system", "content": sys_content}] + (history or []) + [{"role": "user", "content": message}]
    used = []
    collected_sources = {"reels": [], "pattern_scores": [], "recalled_memories": []}
    
    # Filter tools if memory is off
    tools = TOOL_SCHEMAS
    if not memory_on:
        tools = [t for t in TOOL_SCHEMAS if t["function"]["name"] not in ("query_memory",)]

    for _ in range(5):
        m = complete(msgs, tools=tools).choices[0].message
        if not m.tool_calls:
            return {
                "reply": m.content,
                "tools_used": used,
                "sources": collected_sources
            }
        msgs.append({
            "role": "assistant",
            "content": m.content or "",
            "tool_calls": [
                {"id": t.id, "type": "function", "function": {"name": t.function.name, "arguments": t.function.arguments}}
                for t in m.tool_calls
            ]
        })
        for t in m.tool_calls:
            try:
                args = json.loads(t.function.arguments or "{}")
                if t.function.name in REGISTRY:
                    result = REGISTRY[t.function.name](creator_id, **args)
                else:
                    result = {"error": f"Tool {t.function.name} is not available."}
            except Exception as e:
                result = {"error": str(e)}
            
            used.append(t.function.name)
            
            # Aggregate sources
            if isinstance(result, dict) and "sources" in result:
                s = result["sources"]
                if "reels" in s and s["reels"]:
                    existing_ids = {r.get("id") for r in collected_sources["reels"] if isinstance(r, dict) and "id" in r}
                    for r in s["reels"]:
                        if isinstance(r, dict) and r.get("id"):
                            if r["id"] not in existing_ids:
                                collected_sources["reels"].append(r)
                                existing_ids.add(r["id"])
                        else:
                            collected_sources["reels"].append(r)
                if "pattern_scores" in s and s["pattern_scores"]:
                    collected_sources["pattern_scores"] = s["pattern_scores"]
                if "recalled_memories" in s and s["recalled_memories"]:
                    existing_mems = set(collected_sources["recalled_memories"])
                    for mem in s["recalled_memories"]:
                        if mem not in existing_mems:
                            collected_sources["recalled_memories"].append(mem)
                            existing_mems.add(mem)
            
            msgs.append({"role": "tool", "tool_call_id": t.id, "content": json.dumps(result, default=str)})
            
    return {
        "reply": "Sorry, could not complete that request. Please try again.",
        "tools_used": used,
        "sources": collected_sources
    }

