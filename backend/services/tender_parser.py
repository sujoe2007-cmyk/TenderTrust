import re
from typing import Dict, Any, List

class TenderParserService:
    """
    AI-powered Tender & RFP Rule Parser.
    Extracts structured eligibility criteria, statutory requirements, and evaluation formulas.
    """

    @classmethod
    def parse_tender_document(cls, tender_title: str, tender_text: str, estimated_value_cr: float) -> Dict[str, Any]:
        """
        Parses tender text using regex NLP heuristics & structured rule formulation.
        """
        rules = {
            "min_turnover_cr": cls._extract_min_turnover(tender_text, estimated_value_cr),
            "past_experience_years": cls._extract_past_experience(tender_text),
            "min_local_content_pct": cls._extract_mii_percentage(tender_text),
            "msme_emd_exemption": True,
            "msme_turnover_relaxation": True,
            "startup_exemption_eligible": True,
            "mandatory_statutory": {
                "gst_active_required": True,
                "pan_required": True,
                "itr_3yrs_required": True,
                "epfo_esic_required": "epf" in tender_text.lower() or "esic" in tender_text.lower() or "labour" in tender_text.lower() or estimated_value_cr > 0.5,
                "non_blacklisted_affidavit": True,
                "udyam_msme_required_if_claimed": True
            },
            "technical_certifications": cls._extract_certifications(tender_text),
            "oem_authorization_required": "oem" in tender_text.lower() or "manufacturer" in tender_text.lower() or "hardware" in tender_text.lower(),
            "checklist": []
        }

        # Generate structured checklist with clause IDs
        rules["checklist"] = cls._generate_compliance_checklist(rules, estimated_value_cr)
        return rules

    @classmethod
    def _extract_min_turnover(cls, text: str, estimated_value_cr: float) -> float:
        # Check for explicit turnover mentions like "turnover of Rs. 15 Crores" or "30% of estimated value"
        match = re.search(r'turnover\s*(?:of|is|shall be)?\s*(?:rs\.?|inr)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:cr|crore|crores|lakh|lakhs)', text, re.IGNORECASE)
        if match:
            val = float(match.group(1))
            if "lakh" in text[match.start():match.end() + 10].lower():
                return round(val / 100.0, 2)
            return round(val, 2)
        # Standard GeM rule: 30% to 50% of estimated bid value
        return round(max(0.25, estimated_value_cr * 0.4), 2)

    @classmethod
    def _extract_past_experience(cls, text: str) -> int:
        match = re.search(r'([0-9]+)\s*(?:years?|yrs?)\s*(?:of)?\s*experience', text, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return 3

    @classmethod
    def _extract_mii_percentage(cls, text: str) -> float:
        match = re.search(r'local\s*content\s*(?:of|is|minimum)?\s*([0-9]+)\s*%', text, re.IGNORECASE)
        if match:
            return float(match.group(1))
        return 50.0 # Standard Class-I Local Supplier 50%

    @classmethod
    def _extract_certifications(cls, text: str) -> List[str]:
        certs = []
        if re.search(r'iso\s*9001', text, re.IGNORECASE):
            certs.append("ISO 9001:2015 (Quality Management System)")
        if re.search(r'iso\s*27001', text, re.IGNORECASE):
            certs.append("ISO 27001:2022 (Information Security)")
        if re.search(r'cmmi', text, re.IGNORECASE):
            certs.append("CMMI Level 3 or Above")
        if re.search(r'bis', text, re.IGNORECASE):
            certs.append("BIS / Compulsory Registration Scheme")
        if not certs:
            certs.append("ISO 9001:2015 (Quality Management System)")
        return certs

    @classmethod
    def _generate_compliance_checklist(cls, rules: Dict[str, Any], estimated_value_cr: float) -> List[Dict[str, Any]]:
        return [
            {
                "clause_id": "GEM-CLAUSE-01",
                "category": "STATUTORY_REGISTRATION",
                "title": "GST Registration & Return Compliance",
                "requirement": "Bidder must possess a valid, active GSTIN with 100% GSTR-3B and GSTR-1 regular filing in preceding 6 months without default.",
                "mandatory": True,
                "weight": 15
            },
            {
                "clause_id": "GEM-CLAUSE-02",
                "category": "STATUTORY_REGISTRATION",
                "title": "PAN & Income Tax Assessment Filings",
                "requirement": "Bidder must have active PAN with regular ITR filings (ITR-6/5) for last 3 consecutive Assessment Years.",
                "mandatory": True,
                "weight": 15
            },
            {
                "clause_id": "GEM-CLAUSE-03",
                "category": "DEBARMENT_CHECK",
                "title": "Non-Debarment & Integrity Verification",
                "requirement": "Bidder entity, directors, and PAN must NOT be debarred / blacklisted on GeM, CVC, or Central Public Procurement Portal.",
                "mandatory": True,
                "weight": 25 # Critical Gate
            },
            {
                "clause_id": "GEM-CLAUSE-04",
                "category": "FINANCIAL_CAPACITY",
                "title": f"Minimum Average Annual Turnover (INR {rules['min_turnover_cr']} Cr)",
                "requirement": f"Minimum average turnover of INR {rules['min_turnover_cr']} Cr over last 3 financial years verified via CA Certificate with valid UDIN (Exemption applies for registered Micro/Small MSME & Startups).",
                "mandatory": True,
                "weight": 15
            },
            {
                "clause_id": "GEM-CLAUSE-05",
                "category": "POLICY_PREFERENCE",
                "title": f"Make in India (MII) Local Content ({rules['min_local_content_pct']}%)",
                "requirement": f"Class-I Local Supplier declaration with minimum {rules['min_local_content_pct']}% local value addition under DPIIT Order.",
                "mandatory": True,
                "weight": 10
            },
            {
                "clause_id": "GEM-CLAUSE-06",
                "category": "POLICY_PREFERENCE",
                "title": "Udyam / MSME Registration Status",
                "requirement": "Valid Udyam Registration Certificate with matching enterprise PAN, category, and active status for MSME benefits/waivers.",
                "mandatory": False,
                "weight": 5
            },
            {
                "clause_id": "GEM-CLAUSE-07",
                "category": "STATUTORY_REGISTRATION",
                "title": "EPFO & ESIC Compliance",
                "requirement": "Proof of active EPFO Establishment Code & regular Electronic Challan cum Return (ECR) filings for contributing workforce.",
                "mandatory": rules["mandatory_statutory"]["epfo_esic_required"],
                "weight": 5
            },
            {
                "clause_id": "GEM-CLAUSE-08",
                "category": "CORPORATE_GOVERNANCE",
                "title": "MCA21 / ROC Active Company Master Data",
                "requirement": "Active corporate status on Ministry of Corporate Affairs (MCA21) with valid DINs for signatory directors.",
                "mandatory": False,
                "weight": 5
            },
            {
                "clause_id": "GEM-CLAUSE-09",
                "category": "TECHNICAL_ELIGIBILITY",
                "title": "OEM Authorization / Quality Certifications",
                "requirement": f"Manufacturer Authorization Form (MAF) or required certifications: {', '.join(rules['technical_certifications'])}.",
                "mandatory": rules["oem_authorization_required"],
                "weight": 5
            }
        ]
