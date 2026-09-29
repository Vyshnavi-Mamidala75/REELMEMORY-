const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Creator {
  id: string;
  name: string;
  handle?: string;
  niche?: string;
  bio?: string;
  created_at?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  memory: 'connected' | 'offline';
  error?: string;
}

export interface CreatorStatusResponse {
  status: 'connected' | 'offline';
  bank_id?: string;
  supabase_reels?: number;
  memory_units?: number;
  lag?: number;
  error?: string;
}

export interface PatternScore {
  id?: string;
  creator_id: string;
  hook_type: string;
  score: number;
  sample_size: number;
  updated_at?: string;
}

export interface Reel {
  id: string;
  creator_id: string;
  title?: string;
  hook_type: string;
  views: number;
  saves: number;
  shares: number;
  posted_at?: string;
}

export interface MemoryPanelData {
  learned: string;
  scores: PatternScore[];
  recent_reels: Reel[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  tools_used?: string[];
  sources?: {
    reels?: any[];
    pattern_scores?: any[];
    recalled_memories?: string[];
    [key: string]: any;
  };
}

export interface ChatResponse {
  reply: string;
  tools_used: string[];
  sources?: {
    reels?: any[];
    pattern_scores?: any[];
    recalled_memories?: string[];
    [key: string]: any;
  };
}

export interface CompareResponse {
  with_memory: string;
  without_memory: string;
  memory_insight: string;
  why: string;
}

export interface PlanResponse {
  plan: string;
  why: string;
  sources?: any;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.error || errorDetail;
    } catch {
      // fallback
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  getHealth: () => request<HealthResponse>('/health'),
  getCreators: () => request<Creator[]>('/creators'),
  getCreatorStatus: (cid: string) => request<CreatorStatusResponse>(`/creators/${cid}/status`),
  getMemoryPanel: (cid: string) => request<MemoryPanelData>(`/creators/${cid}/memory`),
  chat: (data: { creator_id: string; message: string; history?: any[]; memory_on?: boolean }) =>
    request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  plan: (cid: string, brief: string, memory_on: boolean = true) =>
    request<PlanResponse>(`/creators/${cid}/plan`, {
      method: 'POST',
      body: JSON.stringify({ brief, memory_on }),
    }),
  compare: (cid: string, brief: string, memory_on: boolean = true) =>
    request<CompareResponse>(`/creators/${cid}/compare`, {
      method: 'POST',
      body: JSON.stringify({ brief, memory_on }),
    }),
};
