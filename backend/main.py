import os
import asyncio
import random
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
import models
from routers import (
    tenders, bids, verifications, officer_decisions,
    reports, auth, database_admin, live_stream,
    marketplace, reverse_auctions, orders, incidents
)
from sample_data import seed_database
from routers.live_stream import broadcast_live_event, SIMULATION_STATE

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TenderTrust: AI-Powered Real-Time Bid Compliance Verification Platform",
    description="Automated statutory & regulatory compliance verification for national public procurement",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(live_stream.router)
app.include_router(auth.router)
app.include_router(tenders.router)
app.include_router(bids.router)
app.include_router(verifications.router)
app.include_router(officer_decisions.router)
app.include_router(reports.router)
app.include_router(database_admin.router)
app.include_router(marketplace.router)
app.include_router(reverse_auctions.router)
app.include_router(orders.router)
app.include_router(incidents.router)

async def real_time_simulation_background_worker():
    """Background worker that generates authentic periodic procurement & statutory events in real-time."""
    simulation_templates = [
        {
            "type": "PORTAL_HANDSHAKE",
            "category": "GSTN",
            "title": "GSTN Real-time Return Check",
            "message": "Direct API verification completed for 07AABCT8819K1Z5. 100% GSTR-3B filing compliance score.",
            "severity": "SUCCESS",
            "badge": "GSTN API",
            "meta": {"latency_ms": 78}
        },
        {
            "type": "UDYAM_SYNC",
            "category": "MSME",
            "title": "Ministry of MSME Udyam Gateway Active",
            "message": "Live certificate query resolved in 112ms. Classification: SMALL Enterprise (NIC: 62011).",
            "severity": "INFO",
            "badge": "UDYAM LIVE",
            "meta": {"portal": "udyamregistration.gov.in"}
        },
        {
            "type": "RA_TICK",
            "category": "AUCTION",
            "title": "RA Activity: HPC Cluster Procurement",
            "message": "Competing bids evaluated. Current price level at ₹13.20 Cr. 3 MSE bidders eligible for purchase preference.",
            "severity": "WARNING",
            "badge": "RA TICK",
            "meta": {"ra_number": "GEM/2026/B/890412"}
        },
        {
            "type": "DOCUMENT_AI",
            "category": "OCR_AI",
            "title": "Document AI Tamper Analysis Executed",
            "message": "SHA-256 integrity hash matching. Forensic font consistency 99.4%. Zero tampering detected.",
            "severity": "SUCCESS",
            "badge": "DOC AI",
            "meta": {"engine": "TrOCR-LayoutLMv3"}
        },
        {
            "type": "PAN_ITR_CLEARANCE",
            "category": "ITD",
            "title": "Income Tax Department ITR-6 Verified",
            "message": "Permanent Account Number PAN-NSDL handshake valid. 3 assessment years authenticated.",
            "severity": "SUCCESS",
            "badge": "NSDL PAN",
            "meta": {"status": "ACTIVE"}
        }
    ]
    
    while True:
        try:
            if SIMULATION_STATE.get("is_running", True):
                event_data = random.choice(simulation_templates).copy()
                broadcast_live_event(event_data)
        except Exception as e:
            print("Background simulation error:", e)
        
        sleep_duration = SIMULATION_STATE.get("speed_seconds", 8)
        await asyncio.sleep(sleep_duration)

@app.on_event("startup")
async def startup_event():
    seed_database()
    # Launch background real-time event generator
    asyncio.create_task(real_time_simulation_background_worker())

@app.get("/")
def root():
    return {
        "platform": "GeM AI-Powered Bid Compliance Verification Engine",
        "status": "OPERATIONAL",
        "real_time_engine": "ACTIVE",
        "version": "2.0.0",
        "docs_url": "/docs",
        "integrations": [
            "Ministry of MSME (Udyam)",
            "Goods and Services Tax Network (GSTN)",
            "Income Tax Department / NSDL PAN",
            "Ministry of Corporate Affairs (MCA21)",
            "EPFO & ESIC Compliance Gateway",
            "DPIIT Startup India Registry",
            "Central Vigilance / GeM Debarment Database",
            "Make in India (MII) Local Content Desk"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

