import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from database import Base
import enum

# Enums
class UserRole(str, enum.Enum):
    PROCUREMENT_OFFICER = "PROCUREMENT_OFFICER"
    BUYER_DESK = "BUYER_DESK"
    BUYER = "BUYER" # Backward compatibility alias for BUYER_DESK / PROCUREMENT_OFFICER
    SELLER = "SELLER"
    ADMIN = "ADMIN"
    AUDITOR = "AUDITOR"

class UserStatus(str, enum.Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    ACTIVE = "ACTIVE"
    SUSPENDED = "SUSPENDED"
    DEBARRED = "DEBARRED"

class OrgType(str, enum.Enum):
    CENTRAL_MINISTRY = "CENTRAL_MINISTRY"
    STATE_GOVT = "STATE_GOVT"
    CPSE = "CPSE"
    AUTONOMOUS_BODY = "AUTONOMOUS_BODY"
    DEFENCE = "DEFENCE"
    HEALTHCARE = "HEALTHCARE"

class ConstitutionType(str, enum.Enum):
    PRIVATE_LIMITED = "PRIVATE_LIMITED"
    PUBLIC_LIMITED = "PUBLIC_LIMITED"
    LLP = "LLP"
    PARTNERSHIP = "PARTNERSHIP"
    PROPRIETORSHIP = "PROPRIETORSHIP"
    TRUST_SOCIETY = "TRUST_SOCIETY"

# ----------------------------------------------------------------------------
# 1. BASE USER & AUTHENTICATION MODEL
# ----------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="BUYER", nullable=False) # BUYER, SELLER, ADMIN
    status = Column(String(50), default="ACTIVE") # ACTIVE, PENDING_VERIFICATION, DEBARRED
    phone_number = Column(String(20), nullable=True)
    is_phone_verified = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=True)
    two_factor_enabled = Column(Boolean, default=True)
    aadhaar_linked = Column(Boolean, default=True)
    dsc_serial_number = Column(String(100), nullable=True)
    last_login_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    buyer_profile = relationship("BuyerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    seller_profile = relationship("SellerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

# ----------------------------------------------------------------------------
# 2. TENDER BUYER PROFILE MODEL (Procurement Officers, Ministries, CPSEs)
# ----------------------------------------------------------------------------
class BuyerProfile(Base):
    __tablename__ = "buyer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    gem_buyer_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. BUYER-MEITY-DEL-7712
    officer_name = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=False)
    ministry_name = Column(String(255), nullable=False)
    department_name = Column(String(255), nullable=False)
    organization_type = Column(String(100), default="CENTRAL_MINISTRY")
    office_address = Column(Text, nullable=True)
    city = Column(String(100), default="New Delhi")
    state = Column(String(100), default="Delhi")
    pincode = Column(String(10), default="110001")
    official_gov_email = Column(String(255), nullable=False)
    delegated_financial_power_cr = Column(Float, default=25.0)
    is_primary_user = Column(Boolean, default=True)
    buyer_verification_status = Column(String(50), default="VERIFIED_NIC")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="buyer_profile")

# ----------------------------------------------------------------------------
# 3. TENDER SELLER / BIDDER PROFILE MODEL (Suppliers, MSEs, Startups)
# ----------------------------------------------------------------------------
class SellerProfile(Base):
    __tablename__ = "seller_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    gem_seller_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. SELLER-DL-2026-88190
    legal_business_name = Column(String(255), nullable=False)
    trade_name = Column(String(255), nullable=False)
    constitution_of_business = Column(String(50), default="PRIVATE_LIMITED")
    cin_llpin = Column(String(50), nullable=True)
    pan = Column(String(10), index=True, nullable=False)
    gstin = Column(String(15), index=True, nullable=False)
    udyam_registration_number = Column(String(50), nullable=True)
    msme_category = Column(String(50), default="NONE") # MICRO, SMALL, MEDIUM, NONE
    dpiit_startup_number = Column(String(50), nullable=True)
    is_dpiit_startup = Column(Boolean, default=False)
    make_in_india_class = Column(String(50), default="CLASS_I_LOCAL")
    declared_local_content_pct = Column(Float, default=65.0)
    average_annual_turnover_cr = Column(Float, default=0.0)
    ca_firm_name = Column(String(255), nullable=True)
    ca_udin_number = Column(String(50), nullable=True)
    registered_office_address = Column(Text, nullable=True)
    state = Column(String(100), default="Delhi")
    pincode = Column(String(10), default="110001")
    primary_bank_account_no = Column(String(50), nullable=True)
    bank_ifsc_code = Column(String(20), nullable=True)
    
    # Real-time Statutory API Verification Flags
    verified_with_gstn = Column(Boolean, default=True)
    verified_with_udyam = Column(Boolean, default=True)
    verified_with_pan = Column(Boolean, default=True)
    
    # Debarment & Vigilance Tracking
    debarment_status = Column(String(50), default="CLEAR") # CLEAR, DEBARRED, SUSPENDED
    debarment_reason = Column(Text, nullable=True)
    debarred_by_authority = Column(String(255), nullable=True)
    debarred_until = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="seller_profile")

# ----------------------------------------------------------------------------
# 4. TENDERS & BID COMPLIANCE MODELS
# ----------------------------------------------------------------------------
class Tender(Base):
    __tablename__ = "tenders"

    id = Column(Integer, primary_key=True, index=True)
    gem_bid_id = Column(String(100), unique=True, index=True)
    title = Column(String(255), nullable=False)
    ministry_dept = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    estimated_value = Column(Float, nullable=False)
    emd_amount = Column(Float, default=0.0)
    submission_deadline = Column(String(50))
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    rules_extracted = Column(JSON, default=dict)
    
    # End-to-End Encryption (E2EE) & Tamper-Evident Digital Signature
    is_encrypted = Column(Boolean, default=False)
    encrypted_payload = Column(JSON, nullable=True) # { ciphertext, iv, tag, salt, key_fingerprint }
    encryption_algorithm = Column(String(50), default="AES-256-GCM")
    digital_signature = Column(String(128), nullable=True) # DSC / SHA-256 digital stamp
    
    bids = relationship("BidderSubmission", back_populates="tender", cascade="all, delete-orphan")

class BidderSubmission(Base):
    __tablename__ = "bidder_submissions"

    id = Column(Integer, primary_key=True, index=True)
    tender_id = Column(Integer, ForeignKey("tenders.id"), nullable=False)
    bidder_name = Column(String(255), nullable=False)
    cin = Column(String(50), nullable=True)
    pan = Column(String(20), nullable=False)
    gstin = Column(String(20), nullable=False)
    udyam_no = Column(String(50), nullable=True)
    contact_email = Column(String(100), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    claimed_msme_type = Column(String(50), nullable=True)
    claimed_startup = Column(Boolean, default=False)
    claimed_local_content_pct = Column(Float, default=0.0)
    claimed_turnover_cr = Column(Float, default=0.0)
    submission_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="PENDING_VERIFICATION")
    documents_uploaded = Column(JSON, default=list)

    tender = relationship("Tender", back_populates="bids")
    extracted_docs = relationship("ExtractedDocumentData", back_populates="bidder", cascade="all, delete-orphan")
    portal_snapshots = relationship("GovtPortalSnapshot", back_populates="bidder", cascade="all, delete-orphan")
    evaluation = relationship("ComplianceEvaluation", back_populates="bidder", uselist=False, cascade="all, delete-orphan")
    decisions = relationship("OfficerDecision", back_populates="bidder", cascade="all, delete-orphan")

class ExtractedDocumentData(Base):
    __tablename__ = "extracted_document_data"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidder_submissions.id"), nullable=False)
    doc_type = Column(String(50), nullable=False)
    filename = Column(String(255), nullable=False)
    ocr_confidence = Column(Float, default=0.95)
    extracted_fields = Column(JSON, default=dict)
    raw_ocr_text = Column(Text, nullable=True)
    tampering_score = Column(Float, default=0.0)
    issues_detected = Column(JSON, default=list)
    extracted_at = Column(DateTime, default=datetime.datetime.utcnow)

    bidder = relationship("BidderSubmission", back_populates="extracted_docs")

class GovtPortalSnapshot(Base):
    __tablename__ = "govt_portal_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidder_submissions.id"), nullable=False)
    portal_type = Column(String(50), nullable=False)
    portal_name = Column(String(100), nullable=False)
    endpoint_called = Column(String(255))
    is_active = Column(Boolean, default=True)
    verification_status = Column(String(50))
    raw_response = Column(JSON, default=dict)
    fetched_data = Column(JSON, default=dict)
    verification_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    response_time_ms = Column(Integer, default=120)

    bidder = relationship("BidderSubmission", back_populates="portal_snapshots")

class ComplianceEvaluation(Base):
    __tablename__ = "compliance_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidder_submissions.id"), unique=True, nullable=False)
    overall_score = Column(Float, default=0.0)
    risk_level = Column(String(20), default="LOW")
    compliance_status = Column(String(50), default="VERIFIED")
    checklist_results = Column(JSON, default=list)
    ai_explanation = Column(JSON, default=dict)
    discrepancy_count = Column(Integer, default=0)
    audit_hash = Column(String(64), nullable=False)
    evaluated_at = Column(DateTime, default=datetime.datetime.utcnow)

    bidder = relationship("BidderSubmission", back_populates="evaluation")

class OfficerDecision(Base):
    __tablename__ = "officer_decisions"

    id = Column(Integer, primary_key=True, index=True)
    bidder_id = Column(Integer, ForeignKey("bidder_submissions.id"), nullable=False)
    decision = Column(String(50), nullable=False)
    remarks = Column(Text, nullable=False)
    officer_name = Column(String(100), default="P. K. Sharma (Superintending Procurement Officer)")
    officer_designation = Column(String(100), default="Procurement Officer Grade-I, GeM Cell")
    digital_signature_hash = Column(String(64), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    bidder = relationship("BidderSubmission", back_populates="decisions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=False)
    actor = Column(String(100), default="SYSTEM_AI_ENGINE")
    details = Column(JSON, default=dict)
    hash_signature = Column(String(64), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# ----------------------------------------------------------------------------
# 5. MARKETPLACE & PRODUCTS MODEL
# ----------------------------------------------------------------------------
class MarketplaceProduct(Base):
    __tablename__ = "marketplace_products"

    id = Column(Integer, primary_key=True, index=True)
    product_code = Column(String(100), unique=True, index=True)
    title = Column(String(255), nullable=False)
    brand = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    model = Column(String(100), nullable=True)
    price = Column(Float, nullable=False)
    mrp = Column(Float, nullable=False)
    discount_pct = Column(Float, default=15.0)
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=10)
    image = Column(String(50), default="💻")
    mii_class = Column(String(50), default="CLASS_1")
    local_content_pct = Column(Float, default=65.0)
    msme = Column(Boolean, default=True)
    startup = Column(Boolean, default=False)
    delivery_days = Column(Integer, default=7)
    warranty_years = Column(Integer, default=3)
    specs = Column(JSON, default=dict)
    oem_verified = Column(Boolean, default=True)
    stock = Column(Integer, default=50)
    seller_name = Column(String(255), default="GeM Verified Vendor")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# ----------------------------------------------------------------------------
# 6. ORDERS, CONTRACTS & CRAC MODEL
# ----------------------------------------------------------------------------
class OrderContract(Base):
    __tablename__ = "order_contracts"

    id = Column(Integer, primary_key=True, index=True)
    contract_number = Column(String(100), unique=True, index=True)
    order_title = Column(String(255), nullable=False)
    buyer_id = Column(Integer, nullable=True)
    buyer_name = Column(String(255), default="Superintending Procurement Officer")
    ministry_name = Column(String(255), default="Ministry of Electronics & IT (MeitY)")
    seller_id = Column(Integer, nullable=True)
    seller_name = Column(String(255), nullable=False)
    items = Column(JSON, default=list) # [{ product_id, title, qty, unit_price, total }]
    total_amount_inr = Column(Float, nullable=False)
    status = Column(String(50), default="ORDER_PLACED") # ORDER_PLACED, DISPATCHED, DELIVERED, CRAC_ISSUED, PAID
    order_date = Column(DateTime, default=datetime.datetime.utcnow)
    delivery_due_date = Column(DateTime, nullable=True)
    crac_status = Column(String(50), default="PENDING") # PENDING, ACCEPTED, REJECTED
    crac_generated_at = Column(DateTime, nullable=True)
    crac_remarks = Column(Text, nullable=True)
    invoice_number = Column(String(100), nullable=True)
    invoice_generated_at = Column(DateTime, nullable=True)
    invoice_pdf_data = Column(JSON, nullable=True)
    tracking_details = Column(JSON, default=dict)

# ----------------------------------------------------------------------------
# 7. REVERSE AUCTION (RA) ENGINE MODELS
# ----------------------------------------------------------------------------
class ReverseAuction(Base):
    __tablename__ = "reverse_auctions"

    id = Column(Integer, primary_key=True, index=True)
    ra_number = Column(String(100), unique=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    type = Column(String(50), default="REVERSE_AUCTION")
    status = Column(String(50), default="LIVE_AUCTION") # UPCOMING_RA, LIVE_AUCTION, TECHNICAL_EVALUATION, CONCLUDED
    estimated_value_cr = Column(Float, nullable=False)
    start_price_inr = Column(Float, nullable=False)
    current_l1_inr = Column(Float, nullable=False)
    min_decrement_inr = Column(Float, default=100000.0)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    total_bidders = Column(Integer, default=5)
    qualified_bidders = Column(Integer, default=4)
    msme_preference = Column(Boolean, default=True)
    mii_class1_required = Column(Boolean, default=True)
    current_leader = Column(String(255), default="Swadeshi Supercomputers Ltd.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    bids = relationship("ReverseAuctionBidItem", back_populates="auction", cascade="all, delete-orphan")

class ReverseAuctionBidItem(Base):
    __tablename__ = "reverse_auction_bid_items"

    id = Column(Integer, primary_key=True, index=True)
    auction_id = Column(Integer, ForeignKey("reverse_auctions.id"), nullable=False)
    bidder_name = Column(String(255), nullable=False)
    amount_inr = Column(Float, nullable=False)
    is_l1 = Column(Boolean, default=False)
    status_label = Column(String(50), default="CURRENT_L1")
    bid_time = Column(DateTime, default=datetime.datetime.utcnow)
    remarks = Column(String(255), nullable=True)

    auction = relationship("ReverseAuction", back_populates="bids")

# ----------------------------------------------------------------------------
# 8. INCIDENT MANAGEMENT SYSTEM (IMS) & VIGILANCE MODELS
# ----------------------------------------------------------------------------
class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(100), unique=True, index=True)
    title = Column(String(255), nullable=False)
    reported_by = Column(String(255), nullable=False) # Buyer or Seller Name / Dept
    reported_against = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    category = Column(String(100), default="DELIVERY_DELAY")
    severity = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), default="UNDER_INVESTIGATION") # OPEN, SCN_ISSUED, ESCALATED, RESOLVED, MUTED
    description = Column(Text, nullable=False)
    evidence_docs = Column(JSON, default=list)
    seller_response = Column(Text, nullable=True)
    response_date = Column(DateTime, nullable=True)
    resolution_notes = Column(Text, nullable=True)
    raised_at = Column(DateTime, default=datetime.datetime.utcnow)
    deadline = Column(DateTime, nullable=True)

class DebarredEntityRecord(Base):
    __tablename__ = "debarred_entity_records"

    id = Column(Integer, primary_key=True, index=True)
    pan = Column(String(20), unique=True, index=True, nullable=False)
    entity_name = Column(String(255), nullable=False)
    reason = Column(Text, nullable=False)
    debarred_by = Column(String(255), nullable=False)
    order_no = Column(String(100), nullable=False)
    debarred_from = Column(String(50), nullable=False)
    debarred_until = Column(String(50), nullable=False)
    status = Column(String(50), default="DEBARRED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)



