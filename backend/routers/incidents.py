import datetime
import random
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db
import models
from routers.live_stream import broadcast_live_event

router = APIRouter(prefix="/api/v1/incidents", tags=["Incident Management System (IMS)"])

@router.get("/")
def list_incidents(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieve all logged Incident Management System (IMS) tickets and Show-Cause Notices (SCN)."""
    query = db.query(models.IncidentReport)
    if status and status != "ALL":
        query = query.filter(models.IncidentReport.status == status)
        
    incidents = query.order_by(models.IncidentReport.raised_at.desc()).all()
    results = []
    
    for inc in incidents:
        results.append({
            "id": inc.incident_id or f"INC-{inc.id}",
            "db_id": inc.id,
            "incident_id": inc.incident_id,
            "title": inc.title,
            "reported_by": inc.reported_by,
            "reported_against": inc.reported_against,
            "department": inc.department,
            "category": inc.category,
            "severity": inc.severity,
            "status": inc.status,
            "description": inc.description,
            "evidence_docs": inc.evidence_docs or [],
            "seller_response": inc.seller_response,
            "response_date": inc.response_date.isoformat() if inc.response_date else None,
            "resolution_notes": inc.resolution_notes,
            "raised_at": inc.raised_at.isoformat() if inc.raised_at else None,
            "deadline": inc.deadline.isoformat() if inc.deadline else None
        })
    return results

@router.post("/raise")
def raise_incident(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Raises a statutory Incident on GeM, triggering an automated Show-Cause Notice (SCN)."""
    title = payload.get("title", "Delivery Delay & Non-Compliance with SLA")
    reported_by = payload.get("reported_by", "Ministry of Electronics and IT (MeitY)")
    reported_against = payload.get("reported_against", "Shield Security & Intelligence Services")
    department = payload.get("department", "Public Procurement Cell")
    category = payload.get("category", "DELIVERY_DELAY")
    severity = payload.get("severity", "HIGH")
    description = payload.get("description", "Failure to deliver consignment within stipulated timeline as per Contract条款.")
    
    inc_code = f"INC-2026-{random.randint(10000, 99999)}"
    
    incident = models.IncidentReport(
        incident_id=inc_code,
        title=title,
        reported_by=reported_by,
        reported_against=reported_against,
        department=department,
        category=category,
        severity=severity,
        status="SCN_ISSUED",
        description=description,
        evidence_docs=payload.get("evidence_docs", ["Consignee_Inspection_Report.pdf", "Delivery_Challan_Log.pdf"]),
        raised_at=datetime.datetime.utcnow(),
        deadline=datetime.datetime.utcnow() + datetime.timedelta(days=7)
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    broadcast_live_event({
        "type": "INCIDENT_RAISED",
        "category": "IMS",
        "title": f"Show Cause Notice Issued: {inc_code}",
        "message": f"SCN raised against {reported_against} under {category}. 7-day statutory response clock active.",
        "severity": "CRITICAL" if severity in ["HIGH", "CRITICAL"] else "WARNING",
        "badge": "IMS SCN",
        "meta": {"incident_id": inc_code, "entity": reported_against, "severity": severity}
    })
    
    return {
        "status": "INCIDENT_RAISED_SUCCESSFULLY",
        "incident_id": inc_code,
        "deadline": incident.deadline.isoformat()
    }

@router.post("/respond")
def respond_to_incident(payload: Dict[str, Any] = Body(...), db: Session = Depends(get_db)):
    """Seller submits formal statutory clarification in response to an active SCN ticket."""
    incident_id = payload.get("incident_id")
    response_text = payload.get("response", "We have dispatched the replacement units via expedited air cargo.")
    
    incident = db.query(models.IncidentReport).filter(
        (models.IncidentReport.incident_id == incident_id) |
        (models.IncidentReport.id == int(incident_id) if str(incident_id).isdigit() else False)
    ).first()
    
    if not incident:
        raise HTTPException(status_code=404, detail="Incident report not found")
        
    incident.seller_response = response_text
    incident.response_date = datetime.datetime.utcnow()
    incident.status = "UNDER_INVESTIGATION"
    db.commit()
    
    broadcast_live_event({
        "type": "INCIDENT_RESPONSE",
        "category": "IMS",
        "title": f"SCN Response Received: {incident.incident_id}",
        "message": f"{incident.reported_against} submitted clarification. Under review by Competent Authority.",
        "severity": "INFO",
        "badge": "IMS CLARIFICATION",
        "meta": {"incident_id": incident.incident_id}
    })
    
    return {
        "status": "RESPONSE_RECORDED",
        "incident_id": incident.incident_id,
        "response_date": incident.response_date.isoformat()
    }

@router.get("/debarred-entities")
def get_debarred_entities(db: Session = Depends(get_db)):
    """Retrieve Central Debarment / CVC Blacklist Repository records."""
    entities = db.query(models.DebarredEntityRecord).all()
    results = []
    for e in entities:
        results.append({
            "pan": e.pan,
            "entity_name": e.entity_name,
            "reason": e.reason,
            "debarred_by": e.debarred_by,
            "order_no": e.order_no,
            "debarred_from": e.debarred_from,
            "debarred_until": e.debarred_until,
            "status": e.status
        })
    return results
