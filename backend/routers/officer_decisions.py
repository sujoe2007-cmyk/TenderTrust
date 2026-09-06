from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any
import hashlib
import json
import datetime
from database import get_db
import models

router = APIRouter(prefix="/api/v1/decisions", tags=["Officer Decisions"])

@router.post("/{bid_id}")
def record_officer_decision(
    bid_id: int,
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Procurement Officer records final compliance qualification decision:
    - QUALIFIED (Technical & Statutory Compliance Confirmed)
    - DISQUALIFIED (Disqualification with non-compliance grounds)
    - CLARIFICATION_REQUESTED (48-hour clarification notice issued to bidder)
    """
    bid = db.query(models.BidderSubmission).filter(models.BidderSubmission.id == bid_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Bidder not found")

    decision_type = payload.get("decision")
    if decision_type not in ["QUALIFIED", "DISQUALIFIED", "CLARIFICATION_REQUESTED"]:
        raise HTTPException(status_code=400, detail="Invalid decision type")

    remarks = payload.get("remarks", "").strip()
    if not remarks:
        raise HTTPException(status_code=400, detail="Remarks are mandatory for procurement officer decisions.")

    officer_name = payload.get("officer_name", "P. K. Sharma (Superintending Procurement Officer)")
    officer_designation = payload.get("officer_designation", "Procurement Officer Grade-I, GeM Cell")

    # Generate Digital Signature Hash (SHA-256)
    sig_payload = {
        "bid_id": bid.id,
        "bidder_name": bid.bidder_name,
        "tender_id": bid.tender_id,
        "decision": decision_type,
        "remarks": remarks,
        "officer": officer_name,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    sig_hash = hashlib.sha256(json.dumps(sig_payload, sort_keys=True).encode("utf-8")).hexdigest()

    decision_record = models.OfficerDecision(
        bidder_id=bid.id,
        decision=decision_type,
        remarks=remarks,
        officer_name=officer_name,
        officer_designation=officer_designation,
        digital_signature_hash=sig_hash
    )
    db.add(decision_record)

    # Update bidder status
    bid.status = decision_type
    db.commit()

    # Immutable Audit Log Entry
    db.add(models.AuditLog(
        event_type="OFFICER_DECISION_RECORDED",
        entity_type="DECISION",
        entity_id=str(decision_record.id),
        actor=officer_name,
        details={
            "bid_id": bid.id,
            "decision": decision_type,
            "remarks": remarks,
            "signature_hash": sig_hash
        },
        hash_signature=sig_hash
    ))
    db.commit()

    return {
        "message": f"Officer decision '{decision_type}' recorded successfully.",
        "decision_id": decision_record.id,
        "decision": decision_type,
        "timestamp": decision_record.timestamp.isoformat(),
        "digital_signature_hash": sig_hash
    }

@router.get("/{bid_id}")
def get_decision_history(bid_id: int, db: Session = Depends(get_db)):
    """Retrieve all decision audit logs for a bidder."""
    decisions = db.query(models.OfficerDecision).filter(models.OfficerDecision.bidder_id == bid_id).order_by(models.OfficerDecision.timestamp.desc()).all()
    return [
        {
            "id": d.id,
            "decision": d.decision,
            "remarks": d.remarks,
            "officer_name": d.officer_name,
            "officer_designation": d.officer_designation,
            "digital_signature_hash": d.digital_signature_hash,
            "timestamp": d.timestamp.isoformat() if d.timestamp else None
        }
        for d in decisions
    ]
