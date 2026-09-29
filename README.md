# MIRA (ReelMemory)

> **The AI Agent That Remembers What Works.**  
> Chat-first AI content agent for agencies that remembers what works for each client's Instagram reels, built on Hindsight persistent memory, Groq inference, and Supabase. It learns, then plans the next reel.

---

## 🌟 Key Features

- **Persistent Client Memory Banks**: Dedicated, isolated Hindsight memory banks per client (`creator-<id>`) that continuously reflect and extract patterns from past reel performance.
- **Data-Grounded Planning**: Reel plans are backed by real Exponential Moving Average (EMA) scores and historical save/share metrics rather than generic LLM hallucinations.
- **Side-by-Side Memory Evaluation**: Live comparison showing the difference between generic LLM planning vs. Mira's memory-informed recommendations.
- **Agency Multi-Client Console**: Switch seamlessly between clients with historical reels, hook win-ratios, and live reflection notes.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: FastAPI, Python 3.11+, Uvicorn
- **LLM & Inference**: Groq (`llama-3.3-70b-versatile` / `gpt-oss-120b`)
- **Memory Engine**: Hindsight Cloud
- **Database**: Supabase PostgreSQL

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/Vyshnavi-Mamidala75/REELMEMORY-.git
cd REELMEMORY-

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply your SUPABASE_*, GROQ_API_KEY, and HINDSIGHT_* keys

# Run the FastAPI server
uvicorn main:app --reload --port 8000
```

The API docs are available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` to access the application.

---

## 📄 License

MIT
