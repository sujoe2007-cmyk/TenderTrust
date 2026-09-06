import asyncio
import json
import random
import datetime
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
import models

router = APIRouter(prefix="/api/v1/live", tags=["Real-Time Live Engine"])

# In-memory circular buffer for real-time live events
LIVE_EVENT_BUFFER: List[Dict[str, Any]] = [
    {
        "id": "EVT-INIT-01",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "type": "PORTAL_SYNC",
        "category": "GSTN",
        "title": "GSTN API Handshake Synced",
        "message": "Real-time GSTR-3B return verification engine connected with GSTN Sandbox v2.4 (Response: 84ms).",
        "severity": "INFO",
        "badge": "LIVE GSTN",
        "meta": {"endpoint": "https://api.gstn.gov.in/v2.4/returns", "latency_ms": 84}
    },
    {
        "id": "EVT-INIT-02",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "type": "TENDER_UPDATE",
        "category": "TENDER",
        "title": "Tender Active on GeM National Portal",
        "message": "GeM/2026/B/992011 (MeitY AI Servers) open for live e-bids. 4 technical bids under AI evaluation.",
        "severity": "SUCCESS",
        "badge": "MeitY TENDER",
        "meta": {"tender_id": "GEM/2026/B/992011", "bids_count": 4}
    },
    {
        "id": "EVT-INIT-03",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "type": "REVERSE_AUCTION",
        "category": "AUCTION",
        "title": "Live RA Room Open: HPC Cluster Procurement",
        "message": "Current L1 at ₹13.20 Cr (Swadeshi Supercomputers). Dynamic countdown active.",
        "severity": "WARNING",
        "badge": "RA LIVE",
        "meta": {"ra_number": "GEM/2026/B/890412", "current_l1": 132000000}
    },
    {
        "id": "EVT-INIT-04",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "type": "VIGILANCE_ALERT",
        "category": "CVC",
        "title": "Central Vigilance Debarment Sync Clean",
        "message": "Debarment repository synced across 42 CPSEs and Central Ministries. 2 flagged entities quarantined.",
        "severity": "CRITICAL",
        "badge": "CVC WATCH",
        "meta": {"debarred_tracked": 2, "last_synced": "Just now"}
    }
]

SIMULATION_STATE = {
    "is_running": True,
    "speed_seconds": 8,
    "last_tick": datetime.datetime.utcnow().isoformat(),
    "events_count": len(LIVE_EVENT_BUFFER)
}

def broadcast_live_event(event: Dict[str, Any]):
    """Adds a new real-time event to the live buffer."""
    event["id"] = f"EVT-{datetime.datetime.utcnow().strftime('%H%M%S')}-{random.randint(100, 999)}"
    event["timestamp"] = datetime.datetime.utcnow().isoformat()
    LIVE_EVENT_BUFFER.insert(0, event)
    if len(LIVE_EVENT_BUFFER) > 100:
        LIVE_EVENT_BUFFER.pop()
    SIMULATION_STATE["events_count"] = len(LIVE_EVENT_BUFFER)
    SIMULATION_STATE["last_tick"] = event["timestamp"]

@router.get("/events")
def get_live_events(limit: int = Query(20, ge=1, le=50)):
    """Fetch latest real-time procurement & compliance events from the live buffer."""
    return {
        "status": "LIVE_ACTIVE",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "simulation_state": SIMULATION_STATE,
        "total_buffered": len(LIVE_EVENT_BUFFER),
        "events": LIVE_EVENT_BUFFER[:limit]
    }

@router.get("/stream")
async def sse_event_stream():
    """Server-Sent Events (SSE) live real-time stream for instant browser updates."""
    async def event_generator():
        last_sent_id = None
        while True:
            if LIVE_EVENT_BUFFER:
                latest = LIVE_EVENT_BUFFER[0]
                if latest.get("id") != last_sent_id:
                    last_sent_id = latest.get("id")
                    data = json.dumps(latest)
                    yield f"event: procurement_update\ndata: {data}\n\n"
            await asyncio.sleep(2)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )

@router.post("/trigger-event")
def trigger_custom_live_event(payload: Dict[str, Any]):
    """Manually inject or simulate a specific real-time event for testing and live demonstrations."""
    event_type = payload.get("type", "SIMULATION_TICK")
    title = payload.get("title", "Real-time Live Event")
    message = payload.get("message", "Simulated statutory check completed.")
    category = payload.get("category", "SYSTEM")
    severity = payload.get("severity", "INFO")
    badge = payload.get("badge", "LIVE GeM")
    meta = payload.get("meta", {})

    event = {
        "type": event_type,
        "category": category,
        "title": title,
        "message": message,
        "severity": severity,
        "badge": badge,
        "meta": meta
    }
    broadcast_live_event(event)
    return {"status": "SUCCESS", "broadcasted_event": event}

@router.post("/simulation/toggle")
def toggle_simulation(payload: Dict[str, Any]):
    """Controls the background real-time auto-pilot simulation engine."""
    if "is_running" in payload:
        SIMULATION_STATE["is_running"] = bool(payload["is_running"])
    if "speed_seconds" in payload:
        SIMULATION_STATE["speed_seconds"] = max(2, int(payload["speed_seconds"]))
    return {"status": "UPDATED", "simulation_state": SIMULATION_STATE}

@router.post("/simulate-incoming-bid")
def simulate_live_incoming_bid(db: Session = Depends(get_db)):
    """Simulates an authentic enterprise or MSE bidder submitting a live bid into an active tender."""
    tender = db.query(models.Tender).filter(models.Tender.status == "ACTIVE").first()
    if not tender:
        tender = db.query(models.Tender).first()

    mock_companies = [
        {"name": "Garuda AI Avionics Pvt Ltd", "pan": "AABCG8192K", "msme": "MICRO", "state": "Karnataka", "turnover": 8.5},
        {"name": "VayuShakti Defense Telemetry LLP", "pan": "AABCV9912M", "msme": "SMALL", "state": "Maharashtra", "turnover": 14.2},
        {"name": "Pratham CyberSec Innovations", "pan": "AABCP4401L", "msme": "SMALL", "state": "Telangana", "turnover": 6.8},
        {"name": "Himalaya Quantum Computing Systems", "pan": "AABCH7733N", "msme": "MEDIUM", "state": "Delhi", "turnover": 22.0}
    ]
    company = random.choice(mock_companies)
    gstin = f"07{company['pan']}1Z5"
    udyam_no = f"UDYAM-DL-0{random.randint(1,9)}-00{random.randint(10000,99999)}"

    # Add real-time event
    broadcast_live_event({
        "type": "NEW_BID_SUBMITTED",
        "category": "BIDDER",
        "title": f"New Live Bid: {company['name']}",
        "message": f"Submitted e-Bid for {tender.gem_bid_id if tender else 'GeM/2026/B/992011'}. Statutory API verification underway.",
        "severity": "SUCCESS",
        "badge": f"MSE {company['msme']}",
        "meta": {"bidder_name": company["name"], "pan": company["pan"], "gstin": gstin, "tender_title": tender.title if tender else "AI Cloud"}
    })

    return {
        "status": "BID_SUBMISSION_SIMULATED",
        "bidder": company,
        "tender_id": tender.id if tender else None
    }
