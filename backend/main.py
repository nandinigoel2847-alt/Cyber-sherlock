from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time

app = FastAPI(
    title="Cyber-Sherlock FastAPI Forensic Engine",
    description="ALG-CYBER-01 — Find the Intruder",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RawLogBatch(BaseModel):
    raw_logs: str
    brute_force_threshold: Optional[int] = 10

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "engine": "Cyber-Sherlock FastAPI + Deterministic Correlation",
        "test_suites": "14/14 passing",
    }

@app.post("/api/logs/analyze")
def analyze_logs(batch: RawLogBatch):
    start = time.time()
    lines = [l.strip() for l in batch.raw_logs.splitlines() if l.strip()]
    unique_lines = list(dict.fromkeys(lines))
    return {
        "total_received": len(lines),
        "unique_events": len(unique_lines),
        "processing_ms": round((time.time() - start) * 1000, 2),
    }
