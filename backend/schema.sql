-- ============================================================================
-- GOVERNMENT E-MARKETPLACE (GeM) - USER & IDENTITY SCHEMA (PostgreSQL)
-- Architecture: Separate Role-Based Authentication for Tender Buyer & Seller
-- Compliance: GFR 2017, NIC Guidelines, Aadhaar/DSC e-Sign, GeM Security Policy
-- ============================================================================

-- Create Enums
CREATE TYPE user_role_enum AS ENUM ('BUYER', 'SELLER', 'ADMIN', 'AUDITOR');
CREATE TYPE user_status_enum AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEBARRED');
CREATE TYPE org_type_enum AS ENUM ('CENTRAL_MINISTRY', 'STATE_GOVT', 'CPSE', 'AUTONOMOUS_BODY', 'DEFENCE', 'HEALTHCARE');
CREATE TYPE constitution_enum AS ENUM ('PRIVATE_LIMITED', 'PUBLIC_LIMITED', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP', 'TRUST_SOCIETY');
CREATE TYPE msme_type_enum AS ENUM ('NONE', 'MICRO', 'SMALL', 'MEDIUM');
CREATE TYPE mii_class_enum AS ENUM ('CLASS_I_LOCAL', 'CLASS_II_LOCAL', 'NON_LOCAL');
CREATE TYPE debarment_status_enum AS ENUM ('CLEAR', 'DEBARRED', 'UNDER_INVESTIGATION');

-- ----------------------------------------------------------------------------
-- 1. BASE USERS TABLE (Shared authentication, credentials & security)
-- ----------------------------------------------------------------------------
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL,
    status user_status_enum DEFAULT 'PENDING_VERIFICATION',
    phone_number VARCHAR(20) NOT NULL,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT TRUE,
    aadhaar_linked BOOLEAN DEFAULT FALSE,
    aadhaar_vault_token VARCHAR(255),
    dsc_serial_number VARCHAR(100), -- Digital Signature Certificate (Class 3 DSC)
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- ----------------------------------------------------------------------------
-- 2. TENDER BUYER PROFILES (Procuring Officers, Ministries, DDOs, CPSEs)
-- ----------------------------------------------------------------------------
CREATE TABLE buyer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gem_buyer_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. BUYER-MHA-DEL-09182
    officer_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL, -- e.g. Superintending Procurement Officer Grade-I
    ministry_name VARCHAR(255) NOT NULL, -- e.g. Ministry of Electronics and IT (MeitY)
    department_name VARCHAR(255) NOT NULL,
    organization_type org_type_enum NOT NULL,
    office_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    official_gov_email VARCHAR(255) NOT NULL, -- Must end in .gov.in or .nic.in
    drawing_disbursing_officer_code VARCHAR(50), -- DDO Code
    primary_buyer_id INT REFERENCES buyer_profiles(id), -- For Secondary Buyers linked to HOD
    delegated_financial_power_cr NUMERIC(10, 2) DEFAULT 5.00, -- Maximum INR Crores approval limit
    is_primary_user BOOLEAN DEFAULT FALSE,
    buyer_verification_status VARCHAR(50) DEFAULT 'VERIFIED_NIC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_buyer_gem_id ON buyer_profiles(gem_buyer_id);
CREATE INDEX idx_buyer_ministry ON buyer_profiles(ministry_name);

-- ----------------------------------------------------------------------------
-- 3. TENDER SELLER / BIDDER PROFILES (Enterprises, MSEs, Startups, Suppliers)
-- ----------------------------------------------------------------------------
CREATE TABLE seller_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gem_seller_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. SELLER-DL-2026-99120
    legal_business_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255) NOT NULL,
    constitution_of_business constitution_enum NOT NULL,
    cin_llpin VARCHAR(50), -- Corporate Identification Number (MCA21)
    pan VARCHAR(10) NOT NULL,
    gstin VARCHAR(15) NOT NULL,
    udyam_registration_number VARCHAR(50), -- Ministry of MSME Udyam No
    msme_category msme_type_enum DEFAULT 'NONE',
    dpiit_startup_number VARCHAR(50), -- DPIIT Startup India Recognition No
    is_dpiit_startup BOOLEAN DEFAULT FALSE,
    make_in_india_class mii_class_enum DEFAULT 'CLASS_I_LOCAL',
    declared_local_content_pct NUMERIC(5, 2) DEFAULT 60.00,
    average_annual_turnover_cr NUMERIC(12, 2) DEFAULT 0.00,
    ca_firm_name VARCHAR(255),
    ca_udin_number VARCHAR(50), -- Chartered Accountant UDIN
    registered_office_address TEXT NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    primary_bank_account_no VARCHAR(50) NOT NULL,
    bank_ifsc_code VARCHAR(20) NOT NULL,
    
    -- Real-time Statutory API Verification Flags
    verified_with_gstn BOOLEAN DEFAULT FALSE,
    verified_with_udyam BOOLEAN DEFAULT FALSE,
    verified_with_pan BOOLEAN DEFAULT FALSE,
    verified_with_mca21 BOOLEAN DEFAULT FALSE,
    verified_with_epfo BOOLEAN DEFAULT FALSE,
    
    -- Debarment & Vigilance Tracking
    debarment_status debarment_status_enum DEFAULT 'CLEAR',
    debarment_reason TEXT,
    debarred_by_authority VARCHAR(255),
    debarred_until DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seller_pan ON seller_profiles(pan);
CREATE INDEX idx_seller_gstin ON seller_profiles(gstin);
CREATE INDEX idx_seller_udyam ON seller_profiles(udyam_registration_number);
CREATE INDEX idx_seller_debarment ON seller_profiles(debarment_status);

-- ----------------------------------------------------------------------------
-- 4. USER SESSIONS & DSC TOKEN STORE (Security, Audit & 2FA)
-- ----------------------------------------------------------------------------
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    dsc_signature_hash VARCHAR(64), -- Digital Signature Certificate token
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON user_sessions(session_token);

-- ----------------------------------------------------------------------------
-- 5. AUTHENTICATION & ACCESS AUDIT LOG (Immutable trail for CAG / NIC)
-- ----------------------------------------------------------------------------
CREATE TABLE auth_audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- LOGIN_SUCCESS, LOGIN_FAILED, DSC_SIGN_VERIFIED, PASSWORD_RESET
    ip_address VARCHAR(45) NOT NULL,
    status VARCHAR(50) NOT NULL, -- SUCCESS, FAILED, CHALLENGED
    details JSONB DEFAULT '{}',
    sha256_audit_seal VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_audit_user ON auth_audit_logs(user_id);
CREATE INDEX idx_auth_audit_timestamp ON auth_audit_logs(timestamp);

-- ============================================================================
-- SEED DATA (Standard GeM Buyer & Seller Test Credentials)
-- ============================================================================

-- Buyer 1: Superintending Procurement Officer (MeitY)
INSERT INTO users (id, email, hashed_password, role, status, phone_number, is_email_verified, is_phone_verified, two_factor_enabled)
VALUES (1, 'pk.sharma@meity.gov.in', '$2b$12$e8Yk2uR1zYmY9Q2Z1Xw9E.mOQ1iG.G7Ym6F0aV4xL0iE.L3R6Vz8a', 'BUYER', 'ACTIVE', '+91-9811029381', TRUE, TRUE, TRUE);

INSERT INTO buyer_profiles (user_id, gem_buyer_id, officer_name, designation, ministry_name, department_name, organization_type, office_address, city, state, pincode, official_gov_email, delegated_financial_power_cr, is_primary_user)
VALUES (1, 'BUYER-MEITY-DEL-7712', 'Shri P. K. Sharma', 'Superintending Procurement Officer Grade-I', 'Ministry of Electronics and Information Technology (MeitY)', 'Public Procurement Cell & Cloud Infrastructure Division', 'CENTRAL_MINISTRY', 'Electronics Niketan, 6 CGO Complex, Lodhi Road', 'New Delhi', 'Delhi', '110003', 'pk.sharma@meity.gov.in', 25.00, TRUE);

-- Seller 1: TechNova Digital Solutions (Compliant MSE Bidder)
INSERT INTO users (id, email, hashed_password, role, status, phone_number, is_email_verified, is_phone_verified, two_factor_enabled)
VALUES (2, 'compliance@technovadigital.in', '$2b$12$e8Yk2uR1zYmY9Q2Z1Xw9E.mOQ1iG.G7Ym6F0aV4xL0iE.L3R6Vz8a', 'SELLER', 'ACTIVE', '+91-9871190234', TRUE, TRUE, TRUE);

INSERT INTO seller_profiles (user_id, gem_seller_id, legal_business_name, trade_name, constitution_of_business, cin_llpin, pan, gstin, udyam_registration_number, msme_category, make_in_india_class, declared_local_content_pct, average_annual_turnover_cr, ca_firm_name, ca_udin_number, registered_office_address, state, pincode, primary_bank_account_no, bank_ifsc_code, verified_with_gstn, verified_with_udyam, verified_with_pan)
VALUES (2, 'SELLER-DL-2026-88190', 'TechNova Digital Solutions Pvt Ltd', 'TechNova Systems', 'PRIVATE_LIMITED', 'U72200DL2018PTC339182', 'AABCT8819K', '07AABCT8819K1Z5', 'UDYAM-DL-01-0089124', 'SMALL', 'CLASS_I_LOCAL', 65.00, 12.40, 'M/s A. K. Singhania & Associates', '24098172AAAAAB9182', 'Plot 42, Okhla Industrial Area Phase-III', 'Delhi', '110020', '9812001928312', 'SBIN0001092', TRUE, TRUE, TRUE);

-- Seller 2: Shield Security (Debarred Bidder)
INSERT INTO users (id, email, hashed_password, role, status, phone_number, is_email_verified, is_phone_verified, two_factor_enabled)
VALUES (3, 'bids@shieldinfra.co.in', '$2b$12$e8Yk2uR1zYmY9Q2Z1Xw9E.mOQ1iG.G7Ym6F0aV4xL0iE.L3R6Vz8a', 'SELLER', 'DEBARRED', '+91-9810091823', TRUE, TRUE, TRUE);

INSERT INTO seller_profiles (user_id, gem_seller_id, legal_business_name, trade_name, constitution_of_business, cin_llpin, pan, gstin, udyam_registration_number, msme_category, make_in_india_class, declared_local_content_pct, average_annual_turnover_cr, registered_office_address, state, pincode, primary_bank_account_no, bank_ifsc_code, verified_with_gstn, debarment_status, debarment_reason, debarred_by_authority, debarred_until)
VALUES (3, 'SELLER-DL-2026-77112', 'Shield Security & Intelligence Services', 'Shield Security', 'PRIVATE_LIMITED', 'U74920DL2016PTC298114', 'AABCS7711M', '07AABCS7711M1Z1', 'UDYAM-DL-07-0012938', 'MEDIUM', 'CLASS_I_LOCAL', 55.00, 15.80, 'Sector 18, Rohini', 'Delhi', '110085', '7712009182312', 'HDFC0001290', TRUE, 'DEBARRED', 'Under-quoting statutory minimum wages and fraudulent bank guarantee in MoRTH tender', 'Ministry of Home Affairs / GeM Vigilance', '2028-04-09');
