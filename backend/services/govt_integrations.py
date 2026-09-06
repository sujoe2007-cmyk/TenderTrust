import datetime
import random
import hashlib
from typing import Dict, Any, Optional

class GovernmentIntegrationsService:
    """
    Simulates & integrates with Official Government Portals and Statutory Databases:
    - Udyam MSME Portal (Ministry of MSME)
    - GSTN API (Goods and Services Tax Network)
    - Income Tax Department (ITD) / NSDL PAN Verification
    - MCA21 / Registrar of Companies (Ministry of Corporate Affairs)
    - EPFO (Employees' Provident Fund Organisation)
    - ESIC (Employees' State Insurance Corporation)
    - Startup India (DPIIT / Ministry of Commerce)
    - NSIC (National Small Industries Corporation)
    - Central Public Procurement / GeM Debarment & CVC Blacklist Registry
    - Make in India (DPIIT Local Content Portal)
    """

    # Debarred / Blacklisted database records (Simulated central registry)
    DEBARRED_DATABASE = {
        "AABCK9988D": {
            "entity_name": "Blacklisted Infrastructure Pvt Ltd",
            "reason": "Submission of forged bank guarantee in NHAI Tender GeM/2024/B/10923",
            "debarred_by": "Ministry of Road Transport and Highways (MoRTH)",
            "order_no": "MoRTH/Vig/2024/771-A",
            "debarred_from": "2024-01-15",
            "debarred_until": "2027-01-14",
            "status": "DEBARRED"
        },
        "AABCS7711M": {
            "entity_name": "Shield Security & Intelligence Services",
            "reason": "Corrupt and fraudulent practice; under-quoting statutory minimum wages",
            "debarred_by": "Ministry of Home Affairs / GeM Vigilance Cell",
            "order_no": "MHA/PROC/2025/DEB-99",
            "debarred_from": "2025-04-10",
            "debarred_until": "2028-04-09",
            "status": "DEBARRED"
        }
    }

    @classmethod
    def verify_udyam(cls, udyam_no: str, pan: str, company_name: str) -> Dict[str, Any]:
        """Verify Udyam MSME Registration status with Ministry of MSME"""
        if not udyam_no or not udyam_no.startswith("UDYAM-"):
            return {
                "portal": "UDYAM_MSME",
                "verified": False,
                "status": "NOT_FOUND",
                "message": "Invalid or missing Udyam Registration Number format.",
                "data": None
            }

        # Simulated dynamic or deterministic MSME lookup
        is_micro_or_small = "07-" in udyam_no or "27-" in udyam_no or "29-" in udyam_no
        enterprise_type = "MICRO" if "MICRO" in udyam_no.upper() or "07-" in udyam_no else ("SMALL" if is_micro_or_small else "MEDIUM")
        
        # Determine classification
        return {
            "portal": "UDYAM_MSME",
            "verified": True,
            "status": "ACTIVE",
            "udyam_registration_number": udyam_no,
            "enterprise_name": company_name,
            "pan_linked": pan,
            "enterprise_type": enterprise_type,
            "major_activity": "SERVICES / MANUFACTURING",
            "nic_codes": ["62011", "62020", "62099", "26201"],
            "date_of_incorporation": "2018-06-12",
            "date_of_udyam_registration": "2020-09-15",
            "dic_name": "NEW DELHI / BENGALURU",
            "msme_social_category": "GENERAL",
            "is_valid": True,
            "portal_source": "msme.gov.in / Udyam Direct API v2.1"
        }

    @classmethod
    def verify_gstn(cls, gstin: str, pan: str) -> Dict[str, Any]:
        """Verify GSTIN, Active status and GSTR-3B/1 return filing history with GSTN"""
        if not gstin or len(gstin) != 15:
            return {
                "portal": "GSTN",
                "verified": False,
                "status": "INVALID_FORMAT",
                "message": "GSTIN must be 15 alphanumeric characters.",
                "data": None
            }

        pan_in_gstin = gstin[2:12]
        pan_matches = (pan.upper() == pan_in_gstin.upper())

        # Check for simulated inactive or defaulter GST
        is_inactive = gstin.endswith("9Z9") or "CANCEL" in gstin.upper()
        has_filing_defaults = gstin.endswith("8Z8")

        filing_status_gstr3b = [
            {"period": "2026-01", "status": "FILED", "arn": "AA070126019283K", "filed_date": "2026-02-18"},
            {"period": "2025-12", "status": "FILED", "arn": "AA071225091823M", "filed_date": "2026-01-19"},
            {"period": "2025-11", "status": "NOT_FILED" if has_filing_defaults else "FILED", "arn": "" if has_filing_defaults else "AA071125010294J", "filed_date": "" if has_filing_defaults else "2025-12-20"},
            {"period": "2025-10", "status": "NOT_FILED" if has_filing_defaults else "FILED", "arn": "" if has_filing_defaults else "AA071025088219L", "filed_date": "" if has_filing_defaults else "2025-11-19"},
            {"period": "2025-09", "status": "FILED", "arn": "AA070925019842P", "filed_date": "2025-10-18"},
            {"period": "2025-08", "status": "FILED", "arn": "AA070825099182Q", "filed_date": "2025-09-20"},
        ]

        return {
            "portal": "GSTN",
            "verified": not is_inactive and not has_filing_defaults and pan_matches,
            "status": "CANCELLED" if is_inactive else ("DEFAULTER" if has_filing_defaults else "ACTIVE"),
            "gstin": gstin,
            "legal_name_of_business": "Verified Entity Registered via GSTN",
            "trade_name": "Enterprise Registered Portal Trade Name",
            "pan_in_gstin": pan_in_gstin,
            "pan_matches_bidder": pan_matches,
            "taxpayer_type": "REGULAR",
            "constitution_of_business": "Private Limited Company / Partnership",
            "date_of_registration": "2017-07-01",
            "e_invoice_status": "ENABLED",
            "filing_compliance_score_pct": 66.7 if has_filing_defaults else 100.0,
            "gstr_3b_returns": filing_status_gstr3b,
            "portal_source": "gst.gov.in / GSTN e-Way & Verification API"
        }

    @classmethod
    def verify_pan_and_itr(cls, pan: str, company_name: str) -> Dict[str, Any]:
        """Verify PAN authenticity and Income Tax Return (ITR) filings with Income Tax Dept"""
        if not pan or len(pan) != 10:
            return {
                "portal": "INCOME_TAX_PAN",
                "verified": False,
                "status": "INVALID_PAN",
                "message": "PAN must be a valid 10-character code.",
                "data": None
            }

        pan_fourth_char = pan[3].upper() # C for Company, P for Person, F for Firm, H for HUF
        pan_type = {
            "C": "Company",
            "P": "Individual",
            "F": "Partnership Firm / LLP",
            "H": "HUF",
            "A": "Association of Persons",
            "T": "Trust"
        }.get(pan_fourth_char, "Other Entity")

        return {
            "portal": "INCOME_TAX_PAN",
            "verified": True,
            "status": "ACTIVE_AND_OPERATIVE",
            "pan": pan,
            "pan_holder_name": company_name,
            "pan_type": pan_type,
            "aadhaar_seeding_status": "NOT_APPLICABLE_FOR_COMPANIES" if pan_fourth_char == "C" else "LINKED",
            "itr_filing_compliance": {
                "AY_2025_26": {"status": "FILED", "form": "ITR-6", "acknowledgement_no": f"9821{pan[:5]}2025", "filing_date": "2025-10-31"},
                "AY_2024_25": {"status": "FILED", "form": "ITR-6", "acknowledgement_no": f"8712{pan[:5]}2024", "filing_date": "2024-10-28"},
                "AY_2023_24": {"status": "FILED", "form": "ITR-6", "acknowledgement_no": f"7619{pan[:5]}2023", "filing_date": "2023-10-30"}
            },
            "tax_clearance_status": "CLEAR / NO OUTSTANDING DEMAND",
            "portal_source": "incometax.gov.in / NSDL PAN Verification Service"
        }

    @classmethod
    def verify_mca21(cls, cin: Optional[str], company_name: str) -> Dict[str, Any]:
        """Verify Company Master Data with Ministry of Corporate Affairs (MCA21)"""
        if not cin or len(cin) != 21:
            return {
                "portal": "MCA21_ROC",
                "verified": True, # Might be firm / proprietorship
                "status": "NON_CORPORATE_OR_OPTIONAL",
                "message": "Entity operates as LLP/Proprietorship or CIN was not supplied.",
                "data": None
            }

        return {
            "portal": "MCA21_ROC",
            "verified": True,
            "status": "ACTIVE",
            "cin": cin,
            "company_name": company_name,
            "roc_code": "RoC-Delhi",
            "registration_number": cin[-6:],
            "company_category": "Company limited by Shares",
            "company_subcategory": "Non-govt company",
            "class_of_company": "Private / Public",
            "authorized_capital_inr": 100000000.0,
            "paid_up_capital_inr": 50000000.0,
            "date_of_incorporation": "2015-03-24",
            "last_agm_date": "2025-09-28",
            "balance_sheet_date": "2025-03-31",
            "active_directors_count": 3,
            "directors": [
                {"din": "07182910", "name": "Rajesh Kumar Verma", "designation": "Director", "appointed_date": "2015-03-24"},
                {"din": "08912831", "name": "Sunita Devi Sharma", "designation": "Managing Director", "appointed_date": "2017-06-10"}
            ],
            "portal_source": "mca.gov.in / MCA21 API"
        }

    @classmethod
    def verify_epfo_esic(cls, company_name: str, pan: str) -> Dict[str, Any]:
        """Verify EPFO and ESIC establishment statutory returns and employee strength"""
        has_epfo_issue = "DEF" in pan.upper()
        
        return {
            "portal": "EPFO_AND_ESIC",
            "verified": not has_epfo_issue,
            "epfo": {
                "establishment_id": f"DSNHP{random.randint(1000000, 9999999)}000",
                "establishment_name": company_name,
                "status": "ACTIVE_COVERED",
                "total_contributing_members": 142 if not has_epfo_issue else 0,
                "last_ecr_filed_month": "2026-01",
                "last_ecr_trrn": "1012602008192",
                "dues_default": has_epfo_issue,
                "exemption_status": "UNEXEMPTED"
            },
            "esic": {
                "employer_code": f"11000{random.randint(100000, 999999)}0001001",
                "registration_status": "COMPLIANT",
                "last_return_contribution_period": "2025-09",
                "active_ip_count": 89
            },
            "portal_source": "unifiedportal-emp.epfindia.gov.in & esic.gov.in"
        }

    @classmethod
    def verify_startup_india(cls, pan: str, is_claimed: bool) -> Dict[str, Any]:
        """Verify DPIIT Startup India recognition certificate & 80-IAC exemption"""
        if not is_claimed:
            return {
                "portal": "STARTUP_INDIA",
                "verified": True,
                "status": "NOT_CLAIMED",
                "message": "Bidder has not claimed Startup India exemption.",
                "data": None
            }

        return {
            "portal": "STARTUP_INDIA",
            "verified": True,
            "status": "RECOGNIZED_STARTUP",
            "dpiit_recognition_number": f"DIPP{random.randint(50000, 99999)}",
            "recognition_date": "2022-04-14",
            "industry": "IT Services / Artificial Intelligence",
            "sector": "Enterprise Software",
            "section_80_iac_tax_exemption": "ELIGIBLE_AND_GRANTED",
            "prior_experience_turnover_waiver_eligible": True,
            "portal_source": "startupindia.gov.in / DPIIT National Startup Portal"
        }

    @classmethod
    def verify_debarment_and_blacklist(cls, pan: str, gstin: str, company_name: str) -> Dict[str, Any]:
        """
        Comprehensive cross-check against GeM Debarment list, CVC, Central Procurement Portal (CPPP),
        and Ministry of Finance blacklisted entities.
        """
        # Check against blacklist DB
        if pan in cls.DEBARRED_DATABASE:
            entry = cls.DEBARRED_DATABASE[pan]
            return {
                "portal": "GEM_CVC_DEBARMENT_REGISTRY",
                "verified": False,
                "status": "DEBARRED_ENTITY",
                "is_debarred": True,
                "risk_severity": "CRITICAL",
                "details": entry,
                "message": f"CRITICAL: Bidder {entry['entity_name']} is currently debarred by {entry['debarred_by']} under order {entry['order_no']} until {entry['debarred_until']}!",
                "portal_source": "gem.gov.in/debarment-list & cvc.gov.in"
            }

        # Check by name fuzzy substring
        for deb_pan, deb_info in cls.DEBARRED_DATABASE.items():
            if deb_info["entity_name"].lower() in company_name.lower() or company_name.lower() in deb_info["entity_name"].lower():
                return {
                    "portal": "GEM_CVC_DEBARMENT_REGISTRY",
                    "verified": False,
                    "status": "DEBARRED_ENTITY",
                    "is_debarred": True,
                    "risk_severity": "CRITICAL",
                    "details": deb_info,
                    "message": f"CRITICAL: Name match with Debarred entity: {deb_info['entity_name']}!",
                    "portal_source": "gem.gov.in/debarment-list & cvc.gov.in"
                }

        return {
            "portal": "GEM_CVC_DEBARMENT_REGISTRY",
            "verified": True,
            "status": "CLEAR_NOT_DEBARRED",
            "is_debarred": False,
            "risk_severity": "NONE",
            "message": "Bidder PAN/GSTIN has no active debarment or vigilance proceedings on GeM/CVC registries.",
            "registry_checked_date": datetime.date.today().isoformat(),
            "portal_source": "gem.gov.in/debarment-list & cvc.gov.in"
        }

    @classmethod
    def verify_make_in_india(cls, claimed_local_content_pct: float, category: str) -> Dict[str, Any]:
        """
        Verify Make in India (MII) Local Content declaration under DPIIT Order No. P-45021/2/2017-PP (BE-II)
        """
        classification = "CLASS_I_LOCAL_SUPPLIER" if claimed_local_content_pct >= 50.0 else (
            "CLASS_II_LOCAL_SUPPLIER" if claimed_local_content_pct >= 20.0 else "NON_LOCAL_SUPPLIER"
        )

        return {
            "portal": "MAKE_IN_INDIA_DPIIT",
            "verified": claimed_local_content_pct >= 20.0,
            "status": "COMPLIANT" if claimed_local_content_pct >= 20.0 else "NON_COMPLIANT",
            "supplier_class": classification,
            "declared_local_content_pct": claimed_local_content_pct,
            "dpiit_order_reference": "Public Procurement (Preference to Make in India) Order 2017 as amended",
            "requires_ca_certificate": claimed_local_content_pct > 10.0,
            "portal_source": "dpiit.gov.in / MII Verification Desk"
        }
