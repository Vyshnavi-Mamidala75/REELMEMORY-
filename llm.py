import os, json, time
from groq import Groq

MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
_client = None

def client():
    global _client
    if _client is None:
        _client = Groq(api_key=os.environ["GROQ_API_KEY"])
    return _client

def complete(messages, tools=None, retries=2):
    """Groq call with retry. Function-calling errors happen; retry, then drop tools."""
    last = None
    for i in range(retries + 1):
        try:
            kw = {"model": MODEL, "messages": messages}
            if tools and i < retries:          # last attempt: no tools
                kw["tools"] = tools
                kw["tool_choice"] = "auto"
            return client().chat.completions.create(**kw)
        except Exception as e:
            last = e
            time.sleep(1 + i)
    raise last

def parse_json(text):
    try:
        return json.loads(text[text.index("{"): text.rindex("}") + 1])
    except Exception:
        return {}
