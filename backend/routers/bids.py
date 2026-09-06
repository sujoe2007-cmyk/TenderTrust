from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import datetime
import hashlib
import json
from database import get_db
import models
from services.document_ai import DocumentAIService
from services.govt_integrations import GovernmentIntegrationsService
from services.cross_verifier import CrossVerifierService
from services.ai_risk_engine import AIRiskEngineService
from services.ai_explainer import AIExplainerService

router = APIRouter(prefix="/api/v1/bids", tags=["Bids"])

@router.get("")
def list_bids(tender_id: Optional[int] = None, db: Session = Depends(get_db)):
    """List bids optionally filtered by tender_id."""
    query = db.query(models.BidderSubmission)
    if tender_id:
        query = query.filter(models.BidderSubmission.tender_id == tender_id)
    bids = query.order_by(models.BidderSubmission.submission_date.desc()).all()

    results = []
    for b in bids:
        eval_data = None
        if b.evaluation:
            eval_data = {
                "overall_score": b.evaluation.overall_score,
                "risk_level": b.evaluation.risk_level,
                "compliance_status": b.evaluation.compliance_status,
                "discrepancy_count": b.evaluation.discrepancy_count,
                "audit_hash": b.evaluation.audit_hash
            }
        
        last_decision = None
        if b.decisions:
            d = b.decisions[-1]
            last_decision = {
                "decision": d.decision,
                "remarks": d.remarks,
                "officer_name": d.officer_name,
                "timestamp": d.timestamp.isoformat()
            }

        results.append({
            "id": b.id,
            "tender_id": b.tender_id,
            "tender_title": b.tender.title if b.tender else "",
            "gem_bid_id": b.tender.gem_bid_id if b.tender else "",
            "bidder_name": b.bidder_name,
            "cin": b.cin,
            "pan": b.pan,
            "gstin": b.gstin,
            "udyam_no": b.udyam_no,
            "claimed_msme_type": b.claimed_msme_type,
            "claimed_startup": b.claimed_startup,
            "claimed_local_content_pct": b.claimed_local_content_pct,
            "claimed_turnover_cr": b.claimed_turnover_cr,
            "status": b.status,
            "submission_date": b.submission_date.isoformat() if b.submission_date else None,
            "evaluation": eval_data,
            "last_decision": last_decision,
            "documents_uploaded_count": len(b.documents_uploaded or [])
        })
    return results

@router.get("/{bid_id}")
def get_bid_dossier(bid_id: int, db: Session = Depends(get_db)):
    """
    Returns full Bidder Verification Dossier:
    - Bidder claimed data
    - Document AI extracted fields & OCR confidence
    - Official Government Portal verification records
    - Cross-verification findings & discrepancies
    - AI Risk score, Risk level & Explanation
    - Officer Decision history & Audit Trail
    """
    bid = db.query(models.BidderSubmission).filter(models.BidderSubmission.id == bid_id).first()
    if not bid:
        raise HTTPException(status_code=404, detail="Bidder submission not found")

    # Format extracted docs
    extracted_docs = []
    for d in bid.extracted_docs:
        extracted_docs.append({
            "id": d.id,
            "doc_type": d.doc_type,
            "filename": d.filename,
            "ocr_confidence": d.ocr_confidence,
            "tampering_score": d.tampering_score,
            "extracted_fields": d.extracted_fields,
            "issues_detected": d.issues_detected
        })

    # Format portal snapshots
    portals = []
    for p in bid.portal_snapshots:
        portals.append({
            "id": p.id,
            "portal_type": p.portal_type,
            "portal_name": p.portal_name,
            "is_active": p.is_active,
            "verification_status": p.verification_status,
            "fetched_data": p.fetched_data,
            "verification_timestamp": p.verification_timestamp.isoformat() if p.verification_timestamp else None
        })

    # Evaluation & AI explanation
    evaluation = None
    if bid.evaluation:
        evaluation = {
            "overall_score": bid.evaluation.overall_score,
            "risk_level": bid.evaluation.risk_level,
            "compliance_status": bid.evaluation.compliance_status,
            "discrepancy_count": bid.evaluation.discrepancy_count,
            "audit_hash": bid.evaluation.audit_hash,
            "checklist_results": bid.evaluation.checklist_results,
            "ai_explanation": bid.evaluation.ai_explanation,
            "evaluated_at": bid.evaluation.evaluated_at.isoformat() if bid.evaluation.evaluated_at else None
        }

    # Decisions
    decisions = []
    for dec in bid.decisions:
        decisions.append({
            "id": dec.id,
            "decision": dec.decision,
            "remarks": dec.remarks,
            "officer_name": dec.officer_name,
            "officer_designation": dec.officer_designation,
            "digital_signature_hash": dec.digital_signature_hash,
            "timestamp": dec.timestamp.isoformat() if dec.timestamp else None
        })

    # Extract attached images if present
    attached_images = []
    if bid.documents_uploaded:
        if isinstance(bid.documents_uploaded, dict):
            attached_images = bid.documents_uploaded.get("attached_images", [])
        elif isinstance(bid.documents_uploaded, list):
            for doc in bid.documents_uploaded:
                if isinstance(doc, dict) and doc.get("type") == "ATTACHED_IMAGE":
                    attached_images.append(doc)

    return {
        "id": bid.id,
        "tender_id": bid.tender_id,
        "tender": {
            "id": bid.tender.id,
            "gem_bid_id": bid.tender.gem_bid_id,
            "title": bid.tender.title,
            "ministry_dept": bid.tender.ministry_dept,
            "estimated_value": bid.tender.estimated_value,
            "rules_extracted": bid.tender.rules_extracted
        },
        "bidder_name": bid.bidder_name,
        "cin": bid.cin,
        "pan": bid.pan,
        "gstin": bid.gstin,
        "udyam_no": bid.udyam_no,
        "contact_email": bid.contact_email,
        "contact_phone": bid.contact_phone,
        "claimed_msme_type": bid.claimed_msme_type,
        "claimed_startup": bid.claimed_startup,
        "claimed_local_content_pct": bid.claimed_local_content_pct,
        "claimed_turnover_cr": bid.claimed_turnover_cr,
        "submission_date": bid.submission_date.isoformat() if bid.submission_date else None,
        "status": bid.status,
        "documents_uploaded": bid.documents_uploaded,
        "attached_images": attached_images,
        "extracted_docs": extracted_docs,
        "portal_snapshots": portals,
        "evaluation": evaluation,
        "decisions": decisions
    }

@router.post("")
def submit_bid_and_trigger_verification(
    payload: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    """
    Submits a new bidder package and executes the full AI Verification Pipeline
    (Document AI OCR -> Govt Portal Integration -> Cross-Verification -> AI Risk Engine -> Compliance Report).
    """
    tender_id = payload.get("tender_id")
    tender = None
    if tender_id is not None:
        try:
            tender = db.query(models.Tender).filter(models.Tender.id == int(tender_id)).first()
        except (ValueError, TypeError):
            tender = None
    if not tender:
        tender = db.query(models.Tender).first()
    if not tender:
        raise HTTPException(status_code=404, detail="No active tender found to submit bid against")

    bidder_name = payload.get("bidder_name", "Enterprise Bidder")
    pan = payload.get("pan", "AABCE1234F").upper()
    gstin = payload.get("gstin", f"07{pan}1Z5").upper()
    udyam_no = payload.get("udyam_no", "")
    cin = payload.get("cin", "")
    claimed_msme = payload.get("claimed_msme_type", "NONE")
    claimed_startup = payload.get("claimed_startup", False)
    claimed_local_content = float(payload.get("claimed_local_content_pct", 50.0))
    claimed_turnover = float(payload.get("claimed_turnover_cr", 10.0))
    doc_overrides = payload.get("doc_overrides", {})
    attached_images = payload.get("attached_images", [])

    pdf_docs = [
        {"type": "PAN", "filename": f"PAN_Card_{pan}.pdf"},
        {"type": "GST_CERT", "filename": f"GST_REG06_{gstin}.pdf"},
        {"type": "UDYAM_CERT", "filename": f"Udyam_Registration_{udyam_no or 'none'}.pdf"},
        {"type": "AUDIT_CA", "filename": f"CA_Audited_Turnover_{doc_overrides.get('ca', 'valid')}.pdf"},
        {"type": "ITR", "filename": f"ITR_3Years_Acknowledgement_{pan}.pdf"},
        {"type": "MII_DECLARATION", "filename": f"MII_Local_Content_{claimed_local_content}pct.pdf"},
        {"type": "OEM_AUTH", "filename": f"OEM_MAF_{doc_overrides.get('oem', 'valid')}.pdf"},
        {"type": "NON_BLACKLIST_AFFIDAVIT", "filename": "Non_Blacklisting_Affidavit_100Stamp.pdf"},
        {"type": "EPFO_CHALLAN", "filename": "EPFO_Latest_ECR_Receipt.pdf"}
    ]

    # Create bidder submission record
    bidder = models.BidderSubmission(
        tender_id=tender.id,
        bidder_name=bidder_name,
        cin=cin,
        pan=pan,
        gstin=gstin,
        udyam_no=udyam_no,
        contact_email=payload.get("contact_email", f"tenders@{bidder_name.lower().replace(' ', '')}.com"),
        contact_phone=payload.get("contact_phone", "+91-9811000000"),
        claimed_msme_type=claimed_msme,
        claimed_startup=claimed_startup,
        claimed_local_content_pct=claimed_local_content,
        claimed_turnover_cr=claimed_turnover,
        status="PENDING_VERIFICATION",
        documents_uploaded={
            "pdf_docs": pdf_docs,
            "attached_images": attached_images
        }
    )
    db.add(bidder)
    db.commit()
    db.refresh(bidder)

    # 1. Document AI Extraction
    extracted_docs = []
    for doc_meta in pdf_docs:
        doc_type = doc_meta["type"]
        filename = doc_meta["filename"]
        extracted = DocumentAIService.extract_document_entities(
            doc_type=doc_type,
            filename=filename,
            bidder_metadata={
                "bidder_name": bidder.bidder_name,
                "pan": bidder.pan,
                "gstin": bidder.gstin,
                "udyam_no": bidder.udyam_no,
                "claimed_turnover_cr": bidder.claimed_turnover_cr,
                "claimed_local_content_pct": bidder.claimed_local_content_pct
            }
        )
        db.add(models.ExtractedDocumentData(
            bidder_id=bidder.id,
            doc_type=doc_type,
            filename=filename,
            ocr_confidence=extracted["ocr_confidence"],
            extracted_fields=extracted["extracted_fields"],
            tampering_score=extracted["tampering_score"],
            issues_detected=extracted["issues_detected"]
        ))
        extracted_docs.append(extracted)

    # 2. Multi-portal Government Verification
    portal_data = {}
    
    udyam_res = GovernmentIntegrationsService.verify_udyam(bidder.udyam_no, bidder.pan, bidder.bidder_name)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="UDYAM",
        portal_name="Ministry of MSME - Udyam Registration Portal",
        endpoint_called="/api/v1/udyam/verify",
        is_active=udyam_res.get("verified", False),
        verification_status=udyam_res.get("status", "ACTIVE"),
        fetched_data=udyam_res,
        raw_response=udyam_res
    ))
    portal_data["UDYAM"] = udyam_res

    gst_res = GovernmentIntegrationsService.verify_gstn(bidder.gstin, bidder.pan)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="GSTN",
        portal_name="Goods and Services Tax Network (GSTN)",
        endpoint_called="/api/v1/gstn/verify",
        is_active=gst_res.get("verified", False),
        verification_status=gst_res.get("status", "ACTIVE"),
        fetched_data=gst_res,
        raw_response=gst_res
    ))
    portal_data["GSTN"] = gst_res

    pan_res = GovernmentIntegrationsService.verify_pan_and_itr(bidder.pan, bidder.bidder_name)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="INCOME_TAX_PAN",
        portal_name="Income Tax Dept / NSDL PAN Verification",
        endpoint_called="/api/v1/pan/verify",
        is_active=pan_res.get("verified", True),
        verification_status=pan_res.get("status", "ACTIVE"),
        fetched_data=pan_res,
        raw_response=pan_res
    ))
    portal_data["INCOME_TAX_PAN"] = pan_res

    mca_res = GovernmentIntegrationsService.verify_mca21(bidder.cin, bidder.bidder_name)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="MCA21_ROC",
        portal_name="Ministry of Corporate Affairs (MCA21)",
        endpoint_called="/api/v1/mca21/verify",
        is_active=mca_res.get("verified", True),
        verification_status=mca_res.get("status", "ACTIVE"),
        fetched_data=mca_res,
        raw_response=mca_res
    ))
    portal_data["MCA21_ROC"] = mca_res

    deb_res = GovernmentIntegrationsService.verify_debarment_and_blacklist(bidder.pan, bidder.gstin, bidder.bidder_name)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="GEM_CVC_DEBARMENT_REGISTRY",
        portal_name="GeM Debarment & CVC Blacklist Registry",
        endpoint_called="/api/v1/debarment/verify",
        is_active=not deb_res.get("is_debarred", False),
        verification_status=deb_res.get("status", "CLEAR"),
        fetched_data=deb_res,
        raw_response=deb_res
    ))
    portal_data["GEM_CVC_DEBARMENT_REGISTRY"] = deb_res

    mii_res = GovernmentIntegrationsService.verify_make_in_india(bidder.claimed_local_content_pct, tender.category)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="MAKE_IN_INDIA_DPIIT",
        portal_name="DPIIT Make in India Portal",
        endpoint_called="/api/v1/mii/verify",
        is_active=mii_res.get("verified", True),
        verification_status=mii_res.get("status", "COMPLIANT"),
        fetched_data=mii_res,
        raw_response=mii_res
    ))
    portal_data["MAKE_IN_INDIA_DPIIT"] = mii_res

    epfo_res = GovernmentIntegrationsService.verify_epfo_esic(bidder.bidder_name, bidder.pan)
    db.add(models.GovtPortalSnapshot(
        bidder_id=bidder.id,
        portal_type="EPFO_AND_ESIC",
        portal_name="EPFO Unified & ESIC Portal",
        endpoint_called="/api/v1/epfo/verify",
        is_active=epfo_res.get("verified", True),
        verification_status="ACTIVE",
        fetched_data=epfo_res,
        raw_response=epfo_res
    ))
    portal_data["EPFO_AND_ESIC"] = epfo_res

    db.commit()

    # 3. Cross-verification
    cross_res = CrossVerifierService.cross_verify(
        bidder_data={
            "id": bidder.id,
            "bidder_name": bidder.bidder_name,
            "pan": bidder.pan,
            "gstin": bidder.gstin,
            "claimed_msme_type": bidder.claimed_msme_type,
            "claimed_startup": bidder.claimed_startup,
            "claimed_turnover_cr": bidder.claimed_turnover_cr,
            "claimed_local_content_pct": bidder.claimed_local_content_pct
        },
        extracted_docs=extracted_docs,
        portal_snapshots=portal_data,
        tender_rules=tender.rules_extracted
    )

    # 4. AI Risk evaluation
    risk_res = AIRiskEngineService.evaluate_risk(
        bidder_info={"id": bidder.id, "bidder_name": bidder.bidder_name, "pan": bidder.pan, "gstin": bidder.gstin},
        cross_verification_result=cross_res,
        tender_rules=tender.rules_extracted
    )

    # 5. AI Explanation
    ai_expl = AIExplainerService.generate_explanation(
        bidder_name=bidder.bidder_name,
        risk_result=risk_res,
        cross_verification=cross_res,
        tender_rules=tender.rules_extracted
    )

    # Save evaluation
    eval_model = models.ComplianceEvaluation(
        bidder_id=bidder.id,
        overall_score=risk_res["overall_score"],
        risk_level=risk_res["risk_level"],
        compliance_status=risk_res["compliance_status"],
        checklist_results=ai_expl["findings"],
        ai_explanation=ai_expl,
        discrepancy_count=risk_res["discrepancies_count"],
        audit_hash=risk_res["audit_hash"]
    )
    db.add(eval_model)

    bidder.status = risk_res["compliance_status"]

    # Audit Trail
    db.add(models.AuditLog(
        event_type="BID_VERIFICATION_COMPLETED",
        entity_type="BIDDER",
        entity_id=str(bidder.id),
        actor="AI_VERIFICATION_ENGINE",
        details={
            "score": risk_res["overall_score"],
            "risk_level": risk_res["risk_level"],
            "status": risk_res["compliance_status"]
        },
        hash_signature=risk_res["audit_hash"]
    ))
    db.commit()

    return {
        "message": "Bidder submitted and AI compliance verification completed.",
        "bid_id": bidder.id,
        "compliance_score": risk_res["overall_score"],
        "risk_level": risk_res["risk_level"],
        "status": risk_res["compliance_status"],
        "ai_explanation": ai_expl
    }
