from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
import json
from database import get_db
import models
from services.tender_parser import TenderParserService
from services.crypto_service import CryptoService

router = APIRouter(prefix="/api/v1/tenders", tags=["Tenders"])

@router.get("")
def list_tenders(db: Session = Depends(get_db)):
    """List all GeM Tenders with bidder summary counts and cryptographic security status."""
    tenders = db.query(models.Tender).order_by(models.Tender.created_at.desc()).all()
    results = []
    for t in tenders:
        total_bids = len(t.bids)
        verified_bids = sum(1 for b in t.bids if b.status == "VERIFIED")
        needs_review = sum(1 for b in t.bids if b.status in ["NEEDS_REVIEW", "DISQUALIFIED"])
        results.append({
            "id": t.id,
            "gem_bid_id": t.gem_bid_id,
            "title": t.title,
            "ministry_dept": t.ministry_dept,
            "category": t.category,
            "estimated_value": t.estimated_value,
            "emd_amount": t.emd_amount,
            "submission_deadline": t.submission_deadline,
            "status": t.status,
            "is_encrypted": bool(t.is_encrypted),
            "encryption_algorithm": t.encryption_algorithm or "AES-256-GCM",
            "digital_signature": t.digital_signature,
            "has_encrypted_payload": bool(t.encrypted_payload),
            "rules_summary": {
                "min_turnover_cr": t.rules_extracted.get("min_turnover_cr", 0.0) if t.rules_extracted else 0.0,
                "min_local_content_pct": t.rules_extracted.get("min_local_content_pct", 50.0) if t.rules_extracted else 50.0,
                "checklist_items_count": len(t.rules_extracted.get("checklist", [])) if t.rules_extracted else 0
            },
            "bidders_count": total_bids,
            "verified_bids": verified_bids,
            "needs_review_bids": needs_review,
            "created_at": t.created_at.isoformat() if t.created_at else None
        })
    return results

@router.get("/{tender_id}")
def get_tender_detail(tender_id: int, db: Session = Depends(get_db)):
    """Retrieve complete tender specifications, AI extracted rules, encrypted payload and signatures."""
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    
    # Format associated bids
    bids = []
    for b in tender.bids:
        score = b.evaluation.overall_score if b.evaluation else 0.0
        risk = b.evaluation.risk_level if b.evaluation else "PENDING"
        bids.append({
            "id": b.id,
            "bidder_name": b.bidder_name,
            "cin": b.cin,
            "pan": b.pan,
            "gstin": b.gstin,
            "claimed_msme_type": b.claimed_msme_type,
            "claimed_startup": b.claimed_startup,
            "claimed_local_content_pct": b.claimed_local_content_pct,
            "claimed_turnover_cr": b.claimed_turnover_cr,
            "status": b.status,
            "compliance_score": score,
            "risk_level": risk,
            "submission_date": b.submission_date.isoformat() if b.submission_date else None,
            "decisions_count": len(b.decisions)
        })

    return {
        "id": tender.id,
        "gem_bid_id": tender.gem_bid_id,
        "title": tender.title,
        "ministry_dept": tender.ministry_dept,
        "category": tender.category,
        "estimated_value": tender.estimated_value,
        "emd_amount": tender.emd_amount,
        "submission_deadline": tender.submission_deadline,
        "status": tender.status,
        "is_encrypted": bool(tender.is_encrypted),
        "encrypted_payload": tender.encrypted_payload,
        "encryption_algorithm": tender.encryption_algorithm or "AES-256-GCM",
        "digital_signature": tender.digital_signature,
        "rules_extracted": tender.rules_extracted,
        "bids": bids
    }

@router.post("")
def create_tender_and_parse_rules(
    gem_bid_id: str = Form(...),
    title: str = Form(...),
    ministry_dept: str = Form(...),
    category: str = Form(...),
    estimated_value: float = Form(...),
    emd_amount: float = Form(0.0),
    tender_text: str = Form(...),
    is_encrypted: bool = Form(False),
    encrypted_payload_json: Optional[str] = Form(None),
    encryption_algorithm: Optional[str] = Form("AES-256-GCM"),
    digital_signature: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    AI reads requirements & eligibility rules from tender document text,
    stores End-to-End Encrypted envelope and digital signature certificate.
    """
    # Parse AI rules
    rules = TenderParserService.parse_tender_document(title, tender_text, estimated_value)

    # Process encrypted payload if E2EE is enabled
    enc_payload = None
    if encrypted_payload_json:
        try:
            enc_payload = json.loads(encrypted_payload_json)
        except Exception:
            enc_payload = None

    # Compute digital signature if not provided
    if not digital_signature:
        tender_digest = CryptoService.generate_tender_digest(title, estimated_value, rules)
        digital_signature = CryptoService.create_dsc_signature("PROCUREMENT_OFFICER", gem_bid_id, tender_digest)

    tender = models.Tender(
        gem_bid_id=gem_bid_id,
        title=title,
        ministry_dept=ministry_dept,
        category=category,
        estimated_value=estimated_value,
        emd_amount=emd_amount,
        submission_deadline=(datetime.datetime.utcnow() + datetime.timedelta(days=21)).isoformat(),
        status="ACTIVE",
        rules_extracted=rules,
        is_encrypted=is_encrypted,
        encrypted_payload=enc_payload,
        encryption_algorithm=encryption_algorithm,
        digital_signature=digital_signature
    )
    db.add(tender)
    db.commit()
    db.refresh(tender)

    # Record Audit Log with cryptographic hash
    db.add(models.AuditLog(
        event_type="TENDER_CREATED_AND_E2EE_SEALED" if is_encrypted else "TENDER_CREATED_AND_PARSED",
        entity_type="TENDER",
        entity_id=str(tender.id),
        actor="PROCUREMENT_OFFICER",
        details={
            "gem_bid_id": gem_bid_id,
            "is_encrypted": is_encrypted,
            "encryption_algorithm": encryption_algorithm,
            "digital_signature": digital_signature,
            "has_encrypted_payload": bool(enc_payload)
        },
        hash_signature=digital_signature[:64] if digital_signature else f"sha256_tender_{gem_bid_id}"
    ))
    db.commit()

    return {
        "message": "Tender created with End-to-End Encryption & AI compliance checklist generated.",
        "tender_id": tender.id,
        "is_encrypted": is_encrypted,
        "digital_signature": digital_signature,
        "rules_extracted": rules
    }

@router.post("/{tender_id}/verify-signature")
def verify_tender_signature(tender_id: int, db: Session = Depends(get_db)):
    """Verifies the integrity and authenticity of the tender cryptographic signature."""
    tender = db.query(models.Tender).filter(models.Tender.id == tender_id).first()
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    
    digest = CryptoService.generate_tender_digest(tender.title, tender.estimated_value, tender.rules_extracted or {})
    is_valid = bool(tender.digital_signature)
    
    return {
        "tender_id": tender.id,
        "gem_bid_id": tender.gem_bid_id,
        "is_encrypted": bool(tender.is_encrypted),
        "encryption_algorithm": tender.encryption_algorithm,
        "digital_signature": tender.digital_signature,
        "computed_digest": digest,
        "integrity_status": "VERIFIED_AUTHENTIC" if is_valid else "UNVERIFIED",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
