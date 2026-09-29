from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import db, tools, memory
from agent import chat

app = FastAPI(title="ReelMemory")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class ChatIn(BaseModel):
    creator_id: str
    message: str
    history: list = []
    memory_on: bool = True

class PlanIn(BaseModel):
    brief: str
    memory_on: bool = True

@app.get("/health")
def health():
    try:
        memory.client()
        return {"status": "ok", "memory": "connected"}
    except Exception as e:
        return {"status": "degraded", "memory": "offline", "error": str(e)}

@app.post("/chat")
def chat_ep(b: ChatIn):
    return chat(b.creator_id, b.message, b.history, memory_on=b.memory_on)

class CreatorIn(BaseModel):
    id: str
    name: str
    niche: str = ""

@app.post("/creators")
def create_creator(b: CreatorIn):
    db.sb().table("creators").upsert([b.dict()]).execute()
    memory.ensure_bank(b.id)
    return {"status": "created", "id": b.id}

@app.get("/creators")
def creators():
    return db.sb().table("creators").select("*").execute().data

@app.get("/creators/{cid}/status")
def creator_status(cid: str):
    try:
        b = memory.bank(cid)
        m = memory.client().list_memories(bank_id=b)
        m_count = getattr(m, "total", len(getattr(m, "items", [])))
        sb_reels = len(db.reels(cid))
        return {
            "status": "connected",
            "bank_id": b,
            "supabase_reels": sb_reels,
            "memory_units": m_count,
            "lag": max(0, sb_reels - m_count)
        }
    except Exception as e:
        return {"status": "offline", "error": str(e)}

@app.get("/creators/{cid}/memory")
def memory_panel(cid: str):
    raw_learned = memory.reflect_text(
        cid,
        "In at most 2 short, calm editorial paragraphs without markdown headers or bullet points, "
        "what have you learned about this client's Instagram reels and audience behavior?"
    )
    learned = tools.clean_editorial_text(raw_learned, max_paragraphs=2)
    return {
        "learned": learned or "No observations recorded yet. Log reels to begin learning.",
        "scores": db.scores(cid),
        "recent_reels": db.reels(cid)[-10:]
    }

@app.post("/creators/{cid}/plan")
def plan(cid: str, b: PlanIn):
    return tools.make_plan(cid, b.brief, use_memory=b.memory_on)

@app.post("/creators/{cid}/compare")
def compare(cid: str, b: PlanIn):
    return tools.compare_memory(cid, b.brief)

# run: uvicorn main:app --reload

