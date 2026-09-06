import datetime
from database import SessionLocal, Base, engine
import models
from services.tender_parser import TenderParserService
from services.document_ai import DocumentAIService
from services.govt_integrations import GovernmentIntegrationsService
from services.cross_verifier import CrossVerifierService
from services.ai_risk_engine import AIRiskEngineService
from services.ai_explainer import AIExplainerService
from services.crypto_service import CryptoService

def seed_database():
    """Initializes and pre-seeds the database with rich GeM procurement data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed Users and Profiles if not present
    if db.query(models.User).count() == 0:
        # 1. Buyer User
        buyer_user = models.User(
            id=1,
            email="pk.sharma@meity.gov.in",
            hashed_password="pbkdf2_sha256_mock_hash",
            role="BUYER",
            status="ACTIVE",
            phone_number="+91-9811029381",
            is_phone_verified=True,
            is_email_verified=True,
            two_factor_enabled=True,
            aadhaar_linked=True
        )
        db.add(buyer_user)
        db.commit()

        buyer_prof = models.BuyerProfile(
            user_id=buyer_user.id,
            gem_buyer_id="BUYER-MEITY-DEL-7712",
            officer_name="Shri P. K. Sharma",
            designation="Superintending Procurement Officer Grade-I",
            ministry_name="Ministry of Electronics and Information Technology (MeitY)",
            department_name="Public Procurement Cell & Cloud Infrastructure Division",
            organization_type="CENTRAL_MINISTRY",
            office_address="Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi 110003",
            city="New Delhi",
            state="Delhi",
            pincode="110003",
            official_gov_email="pk.sharma@meity.gov.in",
            delegated_financial_power_cr=25.0,
            is_primary_user=True,
            buyer_verification_status="VERIFIED_NIC"
        )
        db.add(buyer_prof)

        # 2. Seller User (TechNova)
        seller_user1 = models.User(
            id=2,
            email="compliance@technovadigital.in",
            hashed_password="pbkdf2_sha256_mock_hash",
            role="SELLER",
            status="ACTIVE",
            phone_number="+91-9871190234",
            is_phone_verified=True,
            is_email_verified=True,
            two_factor_enabled=True,
            aadhaar_linked=True
        )
        db.add(seller_user1)
        db.commit()

        seller_prof1 = models.SellerProfile(
            user_id=seller_user1.id,
            gem_seller_id="SELLER-DL-2026-88190",
            legal_business_name="TechNova Digital Solutions Pvt Ltd",
            trade_name="TechNova Systems",
            constitution_of_business="PRIVATE_LIMITED",
            cin_llpin="U72200DL2018PTC339182",
            pan="AABCT8819K",
            gstin="07AABCT8819K1Z5",
            udyam_registration_number="UDYAM-DL-01-0089124",
            msme_category="SMALL",
            make_in_india_class="CLASS_I_LOCAL",
            declared_local_content_pct=65.0,
            average_annual_turnover_cr=12.40,
            ca_firm_name="M/s A. K. Singhania & Associates",
            ca_udin_number="24098172AAAAAB9182",
            registered_office_address="Plot 42, Okhla Industrial Area Phase-III, New Delhi 110020",
            state="Delhi",
            pincode="110020",
            primary_bank_account_no="9812001928312",
            bank_ifsc_code="SBIN0001092",
            verified_with_gstn=True,
            verified_with_udyam=True,
            verified_with_pan=True,
            debarment_status="CLEAR"
        )
        db.add(seller_prof1)

        # 3. Seller User (Debarred - Shield Security)
        seller_user2 = models.User(
            id=3,
            email="bids@shieldinfra.co.in",
            hashed_password="pbkdf2_sha256_mock_hash",
            role="SELLER",
            status="DEBARRED",
            phone_number="+91-9810091823",
            is_phone_verified=True,
            is_email_verified=True,
            two_factor_enabled=True,
            aadhaar_linked=True
        )
        db.add(seller_user2)
        db.commit()

        seller_prof2 = models.SellerProfile(
            user_id=seller_user2.id,
            gem_seller_id="SELLER-DL-2026-77112",
            legal_business_name="Shield Security & Intelligence Services",
            trade_name="Shield Security",
            constitution_of_business="PRIVATE_LIMITED",
            cin_llpin="U74920DL2016PTC298114",
            pan="AABCS7711M",
            gstin="07AABCS7711M1Z1",
            udyam_registration_number="UDYAM-DL-07-0012938",
            msme_category="MEDIUM",
            make_in_india_class="CLASS_I_LOCAL",
            declared_local_content_pct=55.0,
            average_annual_turnover_cr=15.80,
            registered_office_address="Sector 18, Rohini, Delhi 110085",
            state="Delhi",
            pincode="110085",
            primary_bank_account_no="7712009182312",
            bank_ifsc_code="HDFC0001290",
            verified_with_gstn=True,
            debarment_status="DEBARRED",
            debarment_reason="Under-quoting statutory minimum wages and fraudulent bank guarantee in MoRTH tender",
            debarred_by_authority="Ministry of Home Affairs / GeM Vigilance",
            debarred_until="2028-04-09"
        )
        db.add(seller_prof2)
        db.commit()

    # Check if already seeded
    if db.query(models.Tender).count() > 0:
        db.close()
        return

    print("Seeding initial GeM Tenders and Bidders...")

    # 1. Tender 1: Cloud & AI Infrastructure
    t1_text = """
    GOVERNMENT OF INDIA - GOVERNMENT E-MARKETPLACE (GeM)
    Bid Reference: GEM/2026/B/892100
    Procuring Entity: Ministry of Electronics and Information Technology (MeitY), New Delhi
    Title: Supply, Installation, Commissioning & 5-Year Maintenance of High-Performance AI Compute Server Clusters.
    Estimated Total Value: Rs. 18.50 Crores
    EMD Amount: Rs. 37,00,000 (Exempted for MSEs and Startups).
    Eligibility & Mandatory Conditions:
    1. Minimum Average Annual Turnover of Rs. 7.50 Crores in the last 3 financial years (2022-23, 2023-24, 2024-25) certified by CA with valid UDIN.
    2. Minimum 5 years of experience in enterprise server deployment.
    3. Make in India (MII): Minimum local content of 50% (Class-I Local Supplier preference applicable).
    4. Bidder must possess valid and active GSTIN with regular return filings and PAN.
    5. Valid EPFO and ESIC registrations required.
    6. Non-Debarment Affidavit: Bidder must not be debarred/blacklisted by GeM, Central Govt or PSUs.
    7. OEM Authorization Form (MAF) strictly mandatory if bidder is an authorized partner/system integrator.
    8. Quality Standards: ISO 9001:2015 and ISO 27001:2022.
    """
    t1_rules = TenderParserService.parse_tender_document(
        "Supply of High-Performance AI Compute Server Clusters",
        t1_text,
        18.5
    )

    t1_envelope = CryptoService.generate_mock_encrypted_envelope("GEM/2026/B/892100", {
        "gem_bid_id": "GEM/2026/B/892100",
        "title": "Supply, Installation & Maintenance of High-Performance AI Compute Server Clusters",
        "ministry_dept": "Ministry of Electronics and Information Technology (MeitY)",
        "category": "Server & Cloud Infrastructure",
        "estimated_value": 18.50,
        "emd_amount": 0.37,
        "rules_extracted": t1_rules
    })

    tender1 = models.Tender(
        gem_bid_id="GEM/2026/B/892100",
        title="Supply, Installation & Maintenance of High-Performance AI Compute Server Clusters",
        ministry_dept="Ministry of Electronics and Information Technology (MeitY)",
        category="Server & Cloud Infrastructure",
        estimated_value=18.50,
        emd_amount=0.37,
        submission_deadline="2026-03-30T17:00:00",
        status="EVALUATION",
        rules_extracted=t1_rules,
        is_encrypted=True,
        encrypted_payload=t1_envelope,
        encryption_algorithm="AES-256-GCM",
        digital_signature=t1_envelope["digital_signature"]
    )
    db.add(tender1)
    db.commit()
    db.refresh(tender1)

    # 2. Tender 2: Medical Imaging Equipment
    t2_text = """
    GOVERNMENT E-MARKETPLACE - HEALTH PROCUREMENT
    Bid Reference: GEM/2026/B/451299
    Procuring Entity: All India Institute of Medical Sciences (AIIMS), New Delhi / MoHFW
    Title: Supply and Commissioning of Advanced Automated Diagnostic Imaging Systems.
    Estimated Value: Rs. 4.80 Crores
    Eligibility: Minimum turnover of Rs. 2.0 Crores. Minimum local content 50%. OEM authorization required.
    """
    t2_rules = TenderParserService.parse_tender_document("Diagnostic Imaging Systems", t2_text, 4.80)

    t2_envelope = CryptoService.generate_mock_encrypted_envelope("GEM/2026/B/451299", {
        "gem_bid_id": "GEM/2026/B/451299",
        "title": "Supply and Commissioning of Advanced Automated Diagnostic Imaging Systems",
        "ministry_dept": "Ministry of Health & Family Welfare (AIIMS Delhi)",
        "category": "Medical Equipment & Devices",
        "estimated_value": 4.80,
        "emd_amount": 0.10,
        "rules_extracted": t2_rules
    })

    tender2 = models.Tender(
        gem_bid_id="GEM/2026/B/451299",
        title="Supply and Commissioning of Advanced Automated Diagnostic Imaging Systems",
        ministry_dept="Ministry of Health & Family Welfare (AIIMS Delhi)",
        category="Medical Equipment & Devices",
        estimated_value=4.80,
        emd_amount=0.10,
        submission_deadline="2026-04-15T15:00:00",
        status="ACTIVE",
        rules_extracted=t2_rules,
        is_encrypted=True,
        encrypted_payload=t2_envelope,
        encryption_algorithm="AES-256-GCM",
        digital_signature=t2_envelope["digital_signature"]
    )
    db.add(tender2)
    db.commit()

    # Define Bidders for Tender 1
    bidders_seed = [
        {
            "bidder_name": "TechNova Digital Solutions Pvt Ltd",
            "cin": "U72200DL2018PTC339182",
            "pan": "AABCT8819K",
            "gstin": "07AABCT8819K1Z5",
            "udyam_no": "UDYAM-DL-01-0089124",
            "contact_email": "tenders@technovadigital.in",
            "contact_phone": "+91-9811029384",
            "claimed_msme_type": "SMALL",
            "claimed_startup": False,
            "claimed_local_content_pct": 65.0,
            "claimed_turnover_cr": 12.40,
            "doc_overrides": {
                "gst": "valid", "ca": "valid", "oem": "valid", "debarment": False
            }
        },
        {
            "bidder_name": "Shield Security & Intelligence Services",
            "cin": "U74920DL2016PTC298114",
            "pan": "AABCS7711M", # In blacklisted registry!
            "gstin": "07AABCS7711M1Z1",
            "udyam_no": "UDYAM-DL-07-0012938",
            "contact_email": "compliance@shieldinfra.co.in",
            "contact_phone": "+91-9871190234",
            "claimed_msme_type": "MEDIUM",
            "claimed_startup": False,
            "claimed_local_content_pct": 55.0,
            "claimed_turnover_cr": 15.80,
            "doc_overrides": {
                "gst": "valid", "ca": "valid", "oem": "valid", "debarment": True
            }
        },
        {
            "bidder_name": "Alpha Grid Infotech Ltd",
            "cin": "U72900KA2019PLC098231",
            "pan": "AABCA5521L",
            "gstin": "29AABCA5521L1Z99Z9", # Inactive / Cancelled GST
            "udyam_no": "UDYAM-KR-03-0077123",
            "contact_email": "gem.bids@alphagrid.com",
            "contact_phone": "+91-9900182736",
            "claimed_msme_type": "NONE",
            "claimed_startup": False,
            "claimed_local_content_pct": 42.0, # Below 50%
            "claimed_turnover_cr": 8.10,
            "doc_overrides": {
                "gst": "cancelled", "ca": "fake_udin", "oem": "valid", "debarment": False
            }
        },
        {
            "bidder_name": "Paramount Electro Dynamics LLP",
            "cin": "AAN-8912",
            "pan": "AAAFP9921B",
            "gstin": "27AAAFP9921B1Z3",
            "udyam_no": "",
            "contact_email": "contracts@paramountelectro.com",
            "contact_phone": "+91-9423187291",
            "claimed_msme_type": "NONE",
            "claimed_startup": False,
            "claimed_local_content_pct": 52.0,
            "claimed_turnover_cr": 2.40, # Below Required 7.50 Cr & not exempt!
            "doc_overrides": {
                "gst": "valid", "ca": "valid", "oem": "expired", "debarment": False
            }
        },
        {
            "bidder_name": "NextGen Quantum AI Labs Pvt Ltd",
            "cin": "U72900TG2022PTC160293",
            "pan": "AABCN4412Q",
            "gstin": "36AABCN4412Q1Z8",
            "udyam_no": "UDYAM-TS-09-0034182",
            "contact_email": "govt@nextgenquantum.ai",
            "contact_phone": "+91-9123456780",
            "claimed_msme_type": "MICRO",
            "claimed_startup": True, # Eligible for turnover/experience waiver
            "claimed_local_content_pct": 82.0,
            "claimed_turnover_cr": 1.20,
            "doc_overrides": {
                "gst": "valid", "ca": "valid", "oem": "valid", "debarment": False
            }
        }
    ]

    for b_seed in bidders_seed:
        b_sub = models.BidderSubmission(
            tender_id=tender1.id,
            bidder_name=b_seed["bidder_name"],
            cin=b_seed["cin"],
            pan=b_seed["pan"],
            gstin=b_seed["gstin"],
            udyam_no=b_seed["udyam_no"],
            contact_email=b_seed["contact_email"],
            contact_phone=b_seed["contact_phone"],
            claimed_msme_type=b_seed["claimed_msme_type"],
            claimed_startup=b_seed["claimed_startup"],
            claimed_local_content_pct=b_seed["claimed_local_content_pct"],
            claimed_turnover_cr=b_seed["claimed_turnover_cr"],
            status="PENDING_VERIFICATION",
            documents_uploaded=[
                {"type": "PAN", "filename": f"PAN_Card_{b_seed['pan']}.pdf"},
                {"type": "GST_CERT", "filename": f"GST_REG06_{b_seed['gstin']}.pdf"},
                {"type": "UDYAM_CERT", "filename": f"Udyam_Registration_{b_seed['udyam_no'] or 'none'}.pdf"},
                {"type": "AUDIT_CA", "filename": f"CA_Audited_Turnover_{b_seed['doc_overrides']['ca']}.pdf"},
                {"type": "ITR", "filename": f"ITR_3Years_Acknowledgement_{b_seed['pan']}.pdf"},
                {"type": "MII_DECLARATION", "filename": f"MII_Local_Content_{b_seed['claimed_local_content_pct']}pct.pdf"},
                {"type": "OEM_AUTH", "filename": f"OEM_MAF_{b_seed['doc_overrides']['oem']}.pdf"},
                {"type": "NON_BLACKLIST_AFFIDAVIT", "filename": "Non_Blacklisting_Affidavit_100Stamp.pdf"},
                {"type": "EPFO_CHALLAN", "filename": "EPFO_Latest_ECR_Receipt.pdf"}
            ]
        )
        db.add(b_sub)
        db.commit()
        db.refresh(b_sub)

        # Run automated AI Verification pipeline for each seeded bidder
        _run_verification_pipeline_for_bidder(db, b_sub, tender1, b_seed["doc_overrides"])

    db.close()
    print("Database seeding completed successfully.")

def _run_verification_pipeline_for_bidder(db, bidder: models.BidderSubmission, tender: models.Tender, overrides: dict):
    """Executes the complete 14-step workflow for a single bidder."""
    # Step 1: Document AI OCR extraction
    extracted_docs = []
    for doc_meta in bidder.documents_uploaded:
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
        doc_model = models.ExtractedDocumentData(
            bidder_id=bidder.id,
            doc_type=doc_type,
            filename=filename,
            ocr_confidence=extracted["ocr_confidence"],
            extracted_fields=extracted["extracted_fields"],
            tampering_score=extracted["tampering_score"],
            issues_detected=extracted["issues_detected"]
        )
        db.add(doc_model)
        extracted_docs.append(extracted)

    # Step 2: Multi-portal Government Verification
    portal_data = {}
    
    # Udyam
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

    # GSTN
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

    # PAN & ITR
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

    # MCA21
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

    # Debarment / CVC
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

    # Make in India
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

    # EPFO / ESIC
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

    # Step 3: Cross-verification
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

    # Step 4: AI Risk Engine evaluation
    risk_res = AIRiskEngineService.evaluate_risk(
        bidder_info={"id": bidder.id, "bidder_name": bidder.bidder_name, "pan": bidder.pan, "gstin": bidder.gstin},
        cross_verification_result=cross_res,
        tender_rules=tender.rules_extracted
    )

    # Step 5: AI Explanation Engine
    ai_expl = AIExplainerService.generate_explanation(
        bidder_name=bidder.bidder_name,
        risk_result=risk_res,
        cross_verification=cross_res,
        tender_rules=tender.rules_extracted
    )

    # Save Compliance Evaluation
    evaluation = models.ComplianceEvaluation(
        bidder_id=bidder.id,
        overall_score=risk_res["overall_score"],
        risk_level=risk_res["risk_level"],
        compliance_status=risk_res["compliance_status"],
        checklist_results=ai_expl["findings"],
        ai_explanation=ai_expl,
        discrepancy_count=risk_res["discrepancies_count"],
        audit_hash=risk_res["audit_hash"]
    )
    db.add(evaluation)

    # Update bidder status
    bidder.status = risk_res["compliance_status"]
    db.commit()

    # Seed Marketplace Products if empty
    if db.query(models.MarketplaceProduct).count() == 0:
        products = [
            models.MarketplaceProduct(
                product_code="PROD-MEITY-001",
                title="BharatSys Enterprise AI Workstation V4",
                brand="BharatSys Technologies Ltd.",
                category="Computers & IT",
                model="BS-WS-9900X-AI",
                price=184500.0,
                mrp=235000.0,
                discount_pct=21.0,
                rating=4.8,
                reviews_count=142,
                image="💻",
                mii_class="CLASS_1",
                local_content_pct=78.5,
                msme=True,
                startup=False,
                delivery_days=7,
                warranty_years=3,
                specs={
                    "Processor": "Intel Xeon / AMD Ryzen 9 7950X (16-Core)",
                    "RAM": "64 GB DDR5 ECC 5600MHz",
                    "Storage": "2TB NVMe PCIe 4.0 SSD + 4TB HDD",
                    "GPU": "NVIDIA RTX 4080 16GB Dedicated",
                    "OS": "BOSS Linux / Windows 11 Pro Enterprise Preloaded",
                    "Energy Star": "Certified Tier 8.0"
                },
                oem_verified=True,
                stock=45,
                seller_name="TechNova Digital Solutions Pvt Ltd"
            ),
            models.MarketplaceProduct(
                product_code="PROD-MEITY-002",
                title="SecureNet 48-Port Layer-3 Managed Gigabit Switch",
                brand="NetIndia Cyber Systems",
                category="Networking & Telecom",
                model="NCS-L3-48G-10G-SFP",
                price=92400.0,
                mrp=115000.0,
                discount_pct=20.0,
                rating=4.9,
                reviews_count=89,
                image="🖧",
                mii_class="CLASS_1",
                local_content_pct=82.0,
                msme=True,
                startup=True,
                delivery_days=5,
                warranty_years=5,
                specs={
                    "Port Density": "48 x 10/100/1000 Base-T + 4 x 10G SFP+ Uplinks",
                    "Switching Capacity": "176 Gbps Non-blocking",
                    "Security": "IEEE 802.1X, MACsec, TACACS+, DoS Protection",
                    "Certifications": "TEC Approved, STQC Certified, IPv6 Ready",
                    "Power": "Dual Redundant Hot-Swappable 230V AC"
                },
                oem_verified=True,
                stock=28,
                seller_name="NetIndia Systems Pvt Ltd"
            ),
            models.MarketplaceProduct(
                product_code="PROD-MEITY-003",
                title="Swadeshi Cloud High-Density 2U Rack Server",
                brand="PARAM Cloud Infrastructure Ltd.",
                category="Servers & Storage",
                model="PARAM-SRV-2U-D900",
                price=345000.0,
                mrp=410000.0,
                discount_pct=16.0,
                rating=4.7,
                reviews_count=64,
                image="🖥️",
                mii_class="CLASS_1",
                local_content_pct=65.0,
                msme=False,
                startup=False,
                delivery_days=10,
                warranty_years=5,
                specs={
                    "Processors": "Dual Intel Xeon Gold 6430 (32 Cores / 64 Threads)",
                    "Memory": "128 GB DDR5-4800 Registered ECC (Expandable to 2TB)",
                    "Drive Bays": "12 x 3.5-inch SAS/SATA Hot-Plug Bays",
                    "RAID Controller": "Hardware RAID 0, 1, 5, 6, 10, 50, 60 (8GB Cache)",
                    "Remote Management": "Dedicated IPMI 2.0 with KVM over IP"
                },
                oem_verified=True,
                stock=18,
                seller_name="PARAM Cloud Infrastructure Ltd."
            ),
            models.MarketplaceProduct(
                product_code="PROD-MEITY-004",
                title="A4 Heavy Duty Network Multifunction Laser Printer",
                brand="VidyutPrint India",
                category="Computers & IT",
                model="VP-MFP-4500DN",
                price=24500.0,
                mrp=29000.0,
                discount_pct=15.0,
                rating=4.8,
                reviews_count=110,
                image="🖨️",
                mii_class="CLASS_1",
                local_content_pct=85.0,
                msme=True,
                startup=False,
                delivery_days=3,
                warranty_years=3,
                specs={
                    "Print Speed": "42 ppm (Black & White A4)",
                    "Duty Cycle": "80,000 pages per month",
                    "Connectivity": "Gigabit Ethernet, High-Speed USB 2.0, Wi-Fi",
                    "Duplex": "Automatic 2-Sided Printing & Dual-Scan ADF"
                },
                oem_verified=True,
                stock=120,
                seller_name="Bharat Electro Supplies"
            )
        ]
        for p in products:
            db.add(p)
        db.commit()

    # Seed Reverse Auctions
    if db.query(models.ReverseAuction).count() == 0:
        ra1 = models.ReverseAuction(
            ra_number="GEM/2026/B/890412",
            title="Procurement of High-Throughput High-Performance Computing (HPC) Cluster & Storage Subsystem",
            department="Ministry of Electronics and Information Technology (MeitY)",
            type="REVERSE_AUCTION",
            status="LIVE_AUCTION",
            estimated_value_cr=14.50,
            start_price_inr=145000000.0,
            current_l1_inr=132000000.0,
            min_decrement_inr=200000.0,
            end_time=datetime.datetime.utcnow() + datetime.timedelta(hours=6),
            total_bidders=6,
            qualified_bidders=4,
            msme_preference=True,
            mii_class1_required=True,
            current_leader="Swadeshi Supercomputers Ltd."
        )
        db.add(ra1)
        db.commit()
        db.refresh(ra1)

        bids = [
            models.ReverseAuctionBidItem(auction_id=ra1.id, bidder_name="Bidder_D44 (Swadeshi Supercomputers Ltd.)", amount_inr=132000000.0, is_l1=True, status_label="CURRENT_L1", bid_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)),
            models.ReverseAuctionBidItem(auction_id=ra1.id, bidder_name="Bidder_A92 (PARAM Cloud Technologies)", amount_inr=134000000.0, is_l1=False, status_label="OUTBID", bid_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=28)),
            models.ReverseAuctionBidItem(auction_id=ra1.id, bidder_name="Bidder_C18 (Bharat AI Infrastructures)", amount_inr=138000000.0, is_l1=False, status_label="OUTBID", bid_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)),
            models.ReverseAuctionBidItem(auction_id=ra1.id, bidder_name="Bidder_B07 (IndoCompute OEM)", amount_inr=142000000.0, is_l1=False, status_label="OUTBID", bid_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=70))
        ]
        for b in bids:
            db.add(b)

        ra2 = models.ReverseAuction(
            ra_number="GEM/2026/B/771890",
            title="Design, Supply & Annual Maintenance of Smart Grid Energy Management Substation Gateways",
            department="Ministry of Power - Central Electricity Authority",
            type="CUSTOM_BID",
            status="TECHNICAL_EVALUATION",
            estimated_value_cr=8.20,
            start_price_inr=82000000.0,
            current_l1_inr=78000000.0,
            min_decrement_inr=100000.0,
            end_time=datetime.datetime.utcnow() + datetime.timedelta(days=2),
            total_bidders=5,
            qualified_bidders=5,
            msme_preference=True,
            mii_class1_required=True,
            current_leader="Under Technical Scrutiny"
        )
        db.add(ra2)
        db.commit()

    # Seed Sample Orders & Contracts
    if db.query(models.OrderContract).count() == 0:
        order1 = models.OrderContract(
            contract_number="GEMC-511687791823091",
            order_title="Direct Procurement of 2x A4 Heavy Duty Network Multifunction Laser Printer",
            buyer_name="Shri P. K. Sharma",
            ministry_name="Ministry of Electronics and Information Technology (MeitY)",
            seller_name="Bharat Electro Supplies",
            items=[{
                "product_code": "PROD-MEITY-004",
                "title": "A4 Heavy Duty Network Multifunction Laser Printer",
                "quantity": 2,
                "unit_price": 24500.0,
                "total_price": 49000.0
            }],
            total_amount_inr=49000.0,
            status="CRAC_ISSUED",
            order_date=datetime.datetime.utcnow() - datetime.timedelta(days=4),
            delivery_due_date=datetime.datetime.utcnow() + datetime.timedelta(days=6),
            crac_status="ACCEPTED",
            crac_generated_at=datetime.datetime.utcnow() - datetime.timedelta(days=1),
            crac_remarks="Goods physically inspected and tested at site. Fully compliant with specifications.",
            invoice_number="INV-GEM-2026-88192",
            invoice_generated_at=datetime.datetime.utcnow() - datetime.timedelta(hours=18),
            tracking_details={
                "courier": "GeM Speed Post / BlueDart Secure Logistics",
                "consignment_no": "GEMLOG-2026-881024",
                "estimated_delivery_days": 3
            }
        )
        db.add(order1)
        db.commit()

    # Seed Incident Reports & Debarred Entities
    if db.query(models.IncidentReport).count() == 0:
        inc1 = models.IncidentReport(
            incident_id="INC-2026-7718",
            title="Submission of Inauthentic CA Turnover Certificate (Invalid UDIN)",
            reported_by="Ministry of Health and Family Welfare (Procurement Cell)",
            reported_against="Shield Security & Intelligence Services",
            department="Procurement Vigilance Cell",
            category="FAKE_CERTIFICATE",
            severity="CRITICAL",
            status="SCN_ISSUED",
            description="Bidder submitted CA Turnover Certificate with UDIN not matching ICAI portal. Show-Cause Notice issued.",
            evidence_docs=["ICAI_UDIN_Failed_Handshake.pdf", "Bidder_Claimed_Turnover.pdf"],
            raised_at=datetime.datetime.utcnow() - datetime.timedelta(days=2),
            deadline=datetime.datetime.utcnow() + datetime.timedelta(days=5)
        )
        db.add(inc1)

        deb1 = models.DebarredEntityRecord(
            pan="AABCK9988D",
            entity_name="Blacklisted Infrastructure Pvt Ltd",
            reason="Submission of forged bank guarantee in NHAI Tender GeM/2024/B/10923",
            debarred_by="Ministry of Road Transport and Highways (MoRTH)",
            order_no="MoRTH/Vig/2024/771-A",
            debarred_from="2024-01-15",
            debarred_until="2027-01-14",
            status="DEBARRED"
        )
        deb2 = models.DebarredEntityRecord(
            pan="AABCS7711M",
            entity_name="Shield Security & Intelligence Services",
            reason="Corrupt and fraudulent practice; under-quoting statutory minimum wages",
            debarred_by="Ministry of Home Affairs / GeM Vigilance Cell",
            order_no="MHA/PROC/2025/DEB-99",
            debarred_from="2025-04-10",
            debarred_until="2028-04-09",
            status="DEBARRED"
        )
        db.add(deb1)
        db.add(deb2)
        db.commit()

