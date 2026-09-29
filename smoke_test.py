"""Run FIRST. Proves Hindsight retain/recall/reflect work before you build on it."""
import os, time
from dotenv import load_dotenv
load_dotenv()
import memory

b = "smoke-test"
c = memory.client()
c.retain(bank_id=b, content="Reel: question hook, 12s, Telugu caption, posted Tuesday 9PM. 4200 saves, 18000 views.")
c.retain(bank_id=b, content="Reel: price-reveal hook, 30s, English caption, posted Sunday 2PM. 300 saves, 9000 views.")
time.sleep(15)   # retain extracts facts with an LLM; give it a moment
print("RECALL:", c.recall(bank_id=b, query="Which hook style gets the most saves?"))
print("REFLECT:", c.reflect(bank_id=b, query="What should the next reel look like?"))
