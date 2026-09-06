import hashlib
import json
import datetime
from typing import Dict, Any, List

class AIRiskEngineService:
    """
    AI Risk & Compliance Scoring Engine.
    Computes a multi-dimensional compliance score (0-100), evaluates risk classification,
    and creates cryptographic audit seals.
    """

    @classmethod
    def evaluate_risk(
        cls,
        bidder_info: Dict[str, Any],
        cross_verification_result: Dict[str, Any],
        tender_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates compliance score and risk level based on discrepancies and weights.
        """
        discrepancies = cross_verification_result.get("discrepancies", [])
        verified_items = cross_verification_result.get("verified_items", [])
        
        # Base starting score
        score = 100.0

        has_critical = any(d.get("severity") == "CRITICAL" for d in discrepancies)
        has_high = any(d.get("severity") == "HIGH" for d in discrepancies)
        has_medium = any(d.get("severity") == "MEDIUM" for d in discrepancies)

        # Deductions
        for d in discrepancies:
            sev = d.get("severity", "LOW")
            if sev == "CRITICAL":
                score -= 45.0 # Instant drop below passing
            elif sev == "HIGH":
                score -= 22.0
            elif sev == "MEDIUM":
                score -= 10.0
            else:
                score -= 5.0

        score = max(0.0, min(100.0, round(score, 1)))

        # Determine Risk Level
        if has_critical or score < 45.0:
            risk_level = "CRITICAL"
            compliance_status = "DISQUALIFIED"
        elif has_high or score < 70.0:
            risk_level = "HIGH"
            compliance_status = "NEEDS_REVIEW"
        elif has_medium or score < 85.0:
            risk_level = "MEDIUM"
            compliance_status = "NEEDS_REVIEW"
        else:
            risk_level = "LOW"
            compliance_status = "VERIFIED"

        # Generate cryptographic audit hash
        hash_payload = {
            "bidder_id": bidder_info.get("id"),
            "bidder_name": bidder_info.get("bidder_name"),
            "pan": bidder_info.get("pan"),
            "gstin": bidder_info.get("gstin"),
            "score": score,
            "risk_level": risk_level,
            "discrepancies_count": len(discrepancies),
            "timestamp": datetime.datetime.utcnow().isoformat()
        }
        audit_hash = hashlib.sha256(json.dumps(hash_payload, sort_keys=True).encode("utf-8")).hexdigest()

        return {
            "overall_score": score,
            "risk_level": risk_level,
            "compliance_status": compliance_status,
            "discrepancies_count": len(discrepancies),
            "verified_count": len(verified_items),
            "has_critical_failure": has_critical,
            "audit_hash": audit_hash,
            "evaluated_at": datetime.datetime.utcnow().isoformat()
        }
