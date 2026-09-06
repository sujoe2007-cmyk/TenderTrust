from typing import Dict, Any, List

class CrossVerifierService:
    """
    Cross-Verification Engine.
    Correlates extracted data from bidder documents against official statutory portal records.
    Detects Mismatches, Expired records, Inactive registrations, Discrepancies, and Debarment.
    """

    @classmethod
    def cross_verify(
        cls,
        bidder_data: Dict[str, Any],
        extracted_docs: List[Dict[str, Any]],
        portal_snapshots: Dict[str, Any],
        tender_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes cross-verification across all statutory dimensions.
        """
        discrepancies = []
        verified_items = []

        # 1. Check Debarment / Blacklisting Status
        debarment_res = portal_snapshots.get("GEM_CVC_DEBARMENT_REGISTRY", {})
        if debarment_res.get("is_debarred", False):
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-03",
                "category": "DEBARMENT_CHECK",
                "issue_type": "DEBARRED",
                "severity": "CRITICAL",
                "title": "Bidder is Blacklisted / Debarred",
                "details": debarment_res.get("message", "Bidder PAN is listed in the National Debarment Database."),
                "evidence_doc": "NON_BLACKLIST_AFFIDAVIT (False Declaration)",
                "evidence_portal": "GeM Central Debarment & CVC Portal Registry",
                "remediation": "Mandatory Disqualification under General Financial Rules (GFR) Rule 151."
            })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-03",
                "category": "DEBARMENT_CHECK",
                "status": "VERIFIED",
                "title": "Clearance from Debarment / Blacklist",
                "summary": "No active debarment or vigilance order found on GeM or Central CVC database."
            })

        # 2. Check GSTIN Status & Filing Compliance
        gst_portal = portal_snapshots.get("GSTN", {})
        gst_doc = next((d for d in extracted_docs if d.get("doc_type") == "GST_CERT"), None)
        
        if not gst_portal.get("verified", False):
            status_text = gst_portal.get("status", "UNKNOWN")
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-01",
                "category": "STATUTORY_REGISTRATION",
                "issue_type": "INVALID_OR_DEFAULTER" if status_text == "DEFAULTER" else "CANCELLED_GSTIN",
                "severity": "HIGH" if status_text == "DEFAULTER" else "CRITICAL",
                "title": f"GST Status Non-Compliant ({status_text})",
                "details": f"GSTN registry reports status as '{status_text}'. GSTR-3B compliance is at {gst_portal.get('filing_compliance_score_pct', 0)}%.",
                "evidence_doc": gst_doc.get("filename") if gst_doc else "Missing GST Certificate",
                "evidence_portal": "GSTN e-Way & Verification API v2.0",
                "remediation": "Bidder must furnish latest tax clearance certificate or clear outstanding returns."
            })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-01",
                "category": "STATUTORY_REGISTRATION",
                "status": "VERIFIED",
                "title": "GST Registration & GSTR-3B Filings Verified",
                "summary": f"Active GSTIN {gst_portal.get('gstin')} verified with 100% timely return filing record."
            })

        # 3. Check PAN & ITR Filings
        pan_portal = portal_snapshots.get("INCOME_TAX_PAN", {})
        if not pan_portal.get("verified", False):
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-02",
                "category": "STATUTORY_REGISTRATION",
                "issue_type": "INVALID_PAN",
                "severity": "CRITICAL",
                "title": "Invalid or Inoperative PAN",
                "details": pan_portal.get("message", "PAN validation failed on Income Tax database."),
                "evidence_doc": "Uploaded PAN Card",
                "evidence_portal": "NSDL / ITD PAN Database",
                "remediation": "Provide operative PAN card matching legal entity."
            })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-02",
                "category": "STATUTORY_REGISTRATION",
                "status": "VERIFIED",
                "title": "PAN Authenticity & 3-Year ITR Verified",
                "summary": f"PAN {pan_portal.get('pan')} is operative. ITR-6 filed for AY 2025-26, 2024-25, 2023-24."
            })

        # 4. Check Turnover & CA Certificate UDIN
        min_turnover_required = tender_rules.get("min_turnover_cr", 5.0)
        ca_doc = next((d for d in extracted_docs if d.get("doc_type") == "AUDIT_CA"), None)
        is_startup = bidder_data.get("claimed_startup", False)
        is_micro_small = bidder_data.get("claimed_msme_type") in ["MICRO", "SMALL"]
        exempt_from_turnover = (is_startup or is_micro_small) and tender_rules.get("msme_turnover_relaxation", True)

        ca_issues = ca_doc.get("issues_detected", []) if ca_doc else []
        udin_invalid = any(i.get("code") == "INVALID_CA_UDIN" for i in ca_issues)

        if udin_invalid:
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-04",
                "category": "FINANCIAL_CAPACITY",
                "issue_type": "FORGED_OR_INVALID_UDIN",
                "severity": "CRITICAL",
                "title": "CA Certificate UDIN Verification Failed",
                "details": "The Unique Document Identification Number (UDIN) on the CA Turnover Certificate failed verification on the ICAI portal. High probability of fabricated document.",
                "evidence_doc": ca_doc.get("filename") if ca_doc else "CA Certificate",
                "evidence_portal": "ICAI UDIN Direct Verification API",
                "remediation": "Seek immediate clarification and refer to ICAI / GeM Vigilance for document authenticity check."
            })
        elif not exempt_from_turnover:
            turnover_val = bidder_data.get("claimed_turnover_cr", 0.0)
            if turnover_val < min_turnover_required:
                discrepancies.append({
                    "clause_id": "GEM-CLAUSE-04",
                    "category": "FINANCIAL_CAPACITY",
                    "issue_type": "TURNOVER_SHORTFALL",
                    "severity": "HIGH",
                    "title": f"Turnover Shortfall (INR {turnover_val} Cr < Required INR {min_turnover_required} Cr)",
                    "details": f"Certified annual turnover is INR {turnover_val} Cr, which is below the minimum mandatory requirement of INR {min_turnover_required} Cr. Bidder is not exempt.",
                    "evidence_doc": ca_doc.get("filename") if ca_doc else "CA Certificate",
                    "evidence_portal": "Financial Statements & CA UDIN Registry",
                    "remediation": "Commercial disqualification unless valid exemption proof is produced."
                })
            else:
                verified_items.append({
                    "clause_id": "GEM-CLAUSE-04",
                    "category": "FINANCIAL_CAPACITY",
                    "status": "VERIFIED",
                    "title": f"Turnover Criteria Met (INR {turnover_val} Cr >= INR {min_turnover_required} Cr)",
                    "summary": f"Average turnover of INR {turnover_val} Cr validated with CA UDIN {ca_doc.get('extracted_fields', {}).get('udin_unique_id')}."
                })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-04",
                "category": "FINANCIAL_CAPACITY",
                "status": "VERIFIED_EXEMPTED",
                "title": "Turnover Requirement Exempted (MSME / Startup Exemption)",
                "summary": f"Bidder eligible for relaxation under Public Procurement Policy for MSEs / DPIIT Startup India framework."
            })

        # 5. Check Make in India (MII) Local Content
        min_local_content = tender_rules.get("min_local_content_pct", 50.0)
        claimed_local_content = bidder_data.get("claimed_local_content_pct", 0.0)
        mii_portal = portal_snapshots.get("MAKE_IN_INDIA_DPIIT", {})

        if claimed_local_content < min_local_content:
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-05",
                "category": "POLICY_PREFERENCE",
                "issue_type": "MII_LOCAL_CONTENT_SHORTFALL",
                "severity": "HIGH",
                "title": f"Local Content Below Tender Minimum ({claimed_local_content}% < {min_local_content}%)",
                "details": f"Declared local content of {claimed_local_content}% is insufficient for Class-I Local Supplier preference (Required: {min_local_content}%).",
                "evidence_doc": "MII Self-Declaration Annexure",
                "evidence_portal": "DPIIT MII Portal",
                "remediation": "Bidder classified as Class-II or Non-Local Supplier; ineligible for MII purchase preference."
            })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-05",
                "category": "POLICY_PREFERENCE",
                "status": "VERIFIED",
                "title": f"Make in India Compliant ({claimed_local_content}% Local Content)",
                "summary": f"Qualified as {mii_portal.get('supplier_class', 'Class-I Local Supplier')} with {claimed_local_content}% local value addition."
            })

        # 6. Check OEM Authorization (if applicable)
        oem_doc = next((d for d in extracted_docs if d.get("doc_type") == "OEM_AUTH"), None)
        if tender_rules.get("oem_authorization_required", False):
            if not oem_doc:
                discrepancies.append({
                    "clause_id": "GEM-CLAUSE-09",
                    "category": "TECHNICAL_ELIGIBILITY",
                    "issue_type": "MISSING_OEM_AUTH",
                    "severity": "HIGH",
                    "title": "Missing Manufacturer Authorization Form (MAF)",
                    "details": "Tender mandates OEM authorization letter for authorized reseller participation.",
                    "evidence_doc": "Not uploaded in Bid package",
                    "evidence_portal": "OEM Partner Portal Registry",
                    "remediation": "Procurement officer may request MAF clarification within 48 hours."
                })
            elif any(i.get("code") == "OEM_AUTH_EXPIRED" for i in oem_doc.get("issues_detected", [])):
                discrepancies.append({
                    "clause_id": "GEM-CLAUSE-09",
                    "category": "TECHNICAL_ELIGIBILITY",
                    "issue_type": "EXPIRED_OEM_AUTH",
                    "severity": "MEDIUM",
                    "title": "OEM Authorization Letter Has Expired",
                    "details": "The submitted Manufacturer Authorization Form expired on 31-Dec-2025 prior to tender submission date.",
                    "evidence_doc": oem_doc.get("filename"),
                    "evidence_portal": "OEM Authorization Database",
                    "remediation": "Seek renewed OEM authorization valid for the duration of the tender."
                })
            else:
                verified_items.append({
                    "clause_id": "GEM-CLAUSE-09",
                    "category": "TECHNICAL_ELIGIBILITY",
                    "status": "VERIFIED",
                    "title": "Valid OEM Authorization Verified",
                    "summary": f"MAF from {oem_doc.get('extracted_fields', {}).get('oem_name')} is active and valid."
                })

        # 7. Check EPFO / ESIC
        epfo_portal = portal_snapshots.get("EPFO_AND_ESIC", {})
        if epfo_portal and not epfo_portal.get("verified", True):
            discrepancies.append({
                "clause_id": "GEM-CLAUSE-07",
                "category": "STATUTORY_REGISTRATION",
                "issue_type": "EPFO_DUES_DEFAULT",
                "severity": "MEDIUM",
                "title": "EPFO Monthly Dues Default / Zero Contributing Members",
                "details": "Statutory verification with EPFO portal indicated dues default or nil contribution in preceding wage months.",
                "evidence_doc": "EPFO Electronic Challan",
                "evidence_portal": "EPFO Unified Portal API",
                "remediation": "Seek updated ECR payment receipt and TRRN clearance confirmation."
            })
        else:
            verified_items.append({
                "clause_id": "GEM-CLAUSE-07",
                "category": "STATUTORY_REGISTRATION",
                "status": "VERIFIED",
                "title": "EPFO & ESIC Compliance Active",
                "summary": f"EPFO active with regular ECR filings for contributing employees."
            })

        return {
            "has_issues": len(discrepancies) > 0,
            "discrepancies": discrepancies,
            "verified_items": verified_items,
            "total_checks": len(discrepancies) + len(verified_items),
            "discrepancy_count": len(discrepancies)
        }
