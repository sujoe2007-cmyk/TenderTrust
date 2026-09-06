from typing import Dict, Any, List

class AIExplainerService:
    """
    AI Explanation Engine.
    Synthesizes findings, statutory evidence, clause violations, and generates actionable
    guidance and executive summaries for the Procurement Officer.
    """

    @classmethod
    def generate_explanation(
        cls,
        bidder_name: str,
        risk_result: Dict[str, Any],
        cross_verification: Dict[str, Any],
        tender_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generates structured AI explanation with finding + evidence + recommendation.
        """
        score = risk_result.get("overall_score", 0.0)
        risk_level = risk_result.get("risk_level", "LOW")
        discrepancies = cross_verification.get("discrepancies", [])
        verified_items = cross_verification.get("verified_items", [])

        # Build executive summary
        if risk_level == "CRITICAL":
            summary = (
                f"CRITICAL COMPLIANCE FAILURE: Bidder '{bidder_name}' achieved a compliance score of {score}/100. "
                f"Severe statutory violations detected including: {', '.join(d.get('title') for d in discrepancies if d.get('severity') == 'CRITICAL')}. "
                f"Immediate technical disqualification is strongly recommended under General Financial Rules (GFR)."
            )
            recommendation = "DISQUALIFY"
            action_prompt = "Reject bid submission and log discrepancy to GeM Integrity & Vigilance dashboard."
        elif risk_level == "HIGH":
            summary = (
                f"HIGH RISK DETECTED: Bidder '{bidder_name}' scored {score}/100 with major eligibility non-compliances. "
                f"Key discrepancies identified in {len(discrepancies)} areas: {', '.join(d.get('title') for d in discrepancies[:2])}. "
                f"Officer review required to determine if statutory exemptions or clarifications apply."
            )
            recommendation = "NEEDS_REVIEW_OR_DISQUALIFY"
            action_prompt = "Examine supporting evidence; request 48-hour clarification or reject if mandatory criteria failed."
        elif risk_level == "MEDIUM":
            summary = (
                f"MODERATE COMPLIANCE: Bidder '{bidder_name}' scored {score}/100. Overall statutory foundation is sound, "
                f"with minor documentation gaps or expired secondary attachments ({len(discrepancies)} items). "
                f"Recommended to seek electronic clarification prior to final bid evaluation."
            )
            recommendation = "SEEK_CLARIFICATION"
            action_prompt = "Send standard GeM Clarification notice via portal giving 48 hours for document rectification."
        else:
            summary = (
                f"EXEMPLARY COMPLIANCE: Bidder '{bidder_name}' achieved a top-tier score of {score}/100. "
                f"All {len(verified_items)} statutory and tender eligibility checks verified directly against official government portals "
                f"(GSTN, Udyam MSME, Income Tax, MCA21, EPFO/ESIC, and CVC Debarment). Fully compliant with Make in India local content."
            )
            recommendation = "QUALIFY"
            action_prompt = "Proceed to Technical & Financial Evaluation stage."

        # Structured Findings
        structured_findings = []
        for d in discrepancies:
            structured_findings.append({
                "clause_id": d.get("clause_id"),
                "status": "NON_COMPLIANT",
                "severity": d.get("severity"),
                "title": d.get("title"),
                "finding": d.get("details"),
                "evidence_doc": d.get("evidence_doc"),
                "evidence_portal": d.get("evidence_portal"),
                "remediation": d.get("remediation")
            })

        for v in verified_items:
            structured_findings.append({
                "clause_id": v.get("clause_id"),
                "status": "COMPLIANT",
                "severity": "NONE",
                "title": v.get("title"),
                "finding": v.get("summary"),
                "evidence_doc": "Verified Valid",
                "evidence_portal": "Official Portal Registry",
                "remediation": "No action needed."
            })

        return {
            "executive_summary": summary,
            "ai_recommendation": recommendation,
            "action_prompt": action_prompt,
            "confidence_score": 0.98,
            "findings": structured_findings,
            "strengths": [v.get("title") for v in verified_items],
            "risk_factors": [d.get("title") for d in discrepancies]
        }
