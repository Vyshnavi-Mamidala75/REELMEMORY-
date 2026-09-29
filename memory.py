import os, time, asyncio, concurrent.futures
from dotenv import load_dotenv
load_dotenv()
import hindsight_client
from hindsight_client import Hindsight

def _safe_run_async(coro):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                def run_in_thread():
                    new_loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(new_loop)
                    task = new_loop.create_task(coro)
                    try:
                        return new_loop.run_until_complete(task)
                    finally:
                        new_loop.close()
                return pool.submit(run_in_thread).result()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    task = loop.create_task(coro)
    return loop.run_until_complete(task)

hindsight_client.hindsight_client._run_async = _safe_run_async

_c = None
_known_banks = set()

def client():
    global _c
    if _c is None:
        url = os.environ.get("HINDSIGHT_URL") or os.environ.get("HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io")
        kw = {"base_url": url}
        if os.environ.get("HINDSIGHT_API_KEY"):
            kw["api_key"] = os.environ["HINDSIGHT_API_KEY"]
        _c = Hindsight(**kw)
    return _c

def bank(creator_id):
    return f"creator-{creator_id}"          # one bank per creator: memories never mix

def ensure_bank(creator_id):
    b = bank(creator_id)
    if b in _known_banks:
        return
    try:
        client().create_bank(bank_id=b)
        _known_banks.add(b)
    except Exception:
        # Bank might already exist
        _known_banks.add(b)

def reel_sentence(r):
    rate = r["saves"] / max(r["views"], 1)
    date_str = str(r.get("posted_at", ""))[:10]
    time_str = f" at {int(r['post_hour']):02d}:00" if r.get("post_hour") is not None else ""
    topic_str = f" about {r['topic']}" if r.get("topic") else ""
    prefix = f"Reel on {date_str}{time_str}{topic_str}:" if date_str else "Reel:"
    
    parts = [f"{r['hook_type']} hook"]
    if r.get("length_sec"):
        parts.append(f"{r['length_sec']}s")
    if r.get("caption_style"):
        parts.append(f"{r['caption_style']} caption")
    details = ", ".join(parts)
    
    return f"{prefix} {details}. Result: {r['views']} views, {r['saves']} saves ({rate:.1%} save rate), {r['shares']} shares."

def remember(creator_id, text, max_retries=4):
    ensure_bank(creator_id)
    for attempt in range(max_retries):
        try:
            client().retain(bank_id=bank(creator_id), content=text)
            return True
        except Exception as e:
            err = str(e).lower()
            if "429" in err or "rate limit" in err or "too many requests" in err:
                wait_sec = 2 ** (attempt + 1)
                print(f"Hindsight 429 on retain ({creator_id}), retry {attempt+1}/{max_retries} in {wait_sec}s...")
                time.sleep(wait_sec)
            elif attempt < max_retries - 1:
                time.sleep(1 + attempt)
            else:
                print("hindsight retain failed:", e)
                return False
    return False

def recall_texts(creator_id, query, limit=8, max_retries=4):
    ensure_bank(creator_id)
    for attempt in range(max_retries):
        try:
            resp = client().recall(bank_id=bank(creator_id), query=query)
            items = getattr(resp, "results", []) or []
            return [getattr(x, "text", str(x)) for x in list(items)[:limit]]
        except Exception as e:
            err = str(e).lower()
            if ("429" in err or "rate limit" in err) and attempt < max_retries - 1:
                time.sleep(2 ** (attempt + 1))
            elif attempt < max_retries - 1:
                time.sleep(1)
            else:
                print("hindsight recall failed:", e)
                return []
    return []

def reflect_text(creator_id, query, max_retries=4):
    """Hindsight reflect: memory-grounded reasoning over consolidated observations."""
    ensure_bank(creator_id)
    for attempt in range(max_retries):
        try:
            resp = client().reflect(bank_id=bank(creator_id), query=query)
            return getattr(resp, "text", "") or ""
        except Exception as e:
            err = str(e).lower()
            if ("429" in err or "rate limit" in err) and attempt < max_retries - 1:
                time.sleep(2 ** (attempt + 1))
            elif attempt < max_retries - 1:
                time.sleep(1)
            else:
                print("hindsight reflect failed:", e)
                return ""
    return ""

