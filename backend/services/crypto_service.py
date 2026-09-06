import hashlib
import json
import secrets
from typing import Dict, Any, Optional

class CryptoService:
    """
    Cryptographic verification & sealing service for GeM End-to-End Encrypted Tenders.
    Handles SHA-256 digital signature computation, envelope integrity verification,
    and audit checksums.
    """

    @staticmethod
    def generate_tender_digest(title: str, estimated_value: float, rules: Dict[str, Any]) -> str:
        """Computes a canonical SHA-256 digest of tender specifications."""
        canonical_str = f"{title.strip()}::{estimated_value:.2f}::{json.dumps(rules, sort_keys=True)}"
        return hashlib.sha256(canonical_str.encode("utf-8")).hexdigest()

    @staticmethod
    def verify_envelope_integrity(encrypted_payload: Dict[str, Any], signature: Optional[str] = None) -> bool:
        """Verifies that an encrypted payload has the required cryptographic components."""
        if not isinstance(encrypted_payload, dict):
            return False
        required_fields = ["ciphertext", "iv", "tag", "salt"]
        for field in required_fields:
            if not encrypted_payload.get(field):
                return False
        return True

    @staticmethod
    def create_dsc_signature(actor: str, tender_bid_id: str, digest: str) -> str:
        """Generates a mock Digital Signature Certificate (DSC) cryptographic stamp."""
        stamp = f"NIC-DSC::{actor}::{tender_bid_id}::{digest}"
        return hashlib.sha256(stamp.encode("utf-8")).hexdigest()

    @staticmethod
    def generate_mock_encrypted_envelope(gem_bid_id: str, payload_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generates a realistic AES-256-GCM encrypted envelope for pre-seeded tenders."""
        raw_json = json.dumps(payload_data, sort_keys=True)
        salt_hex = secrets.token_hex(16)
        iv_hex = secrets.token_hex(12)
        # Mock AES-256-GCM ciphertext representation
        mock_cipher = hashlib.sha256((raw_json + salt_hex + iv_hex).encode("utf-8")).digest()
        import base64
        ciphertext_b64 = base64.b64encode(mock_cipher * 4).decode("utf-8")
        key_fingerprint = hashlib.sha256("GeM@GovNationalSecureKey2026".encode("utf-8")).hexdigest()[:16].upper()
        sig = hashlib.sha256(f"DSC-OFFICER-STAMP::{gem_bid_id}::{salt_hex}::{ciphertext_b64}".encode("utf-8")).hexdigest()

        return {
            "is_encrypted": True,
            "algorithm": "AES-256-GCM",
            "ciphertext": ciphertext_b64,
            "iv": iv_hex,
            "salt": salt_hex,
            "tag": "GCM-128-AUTH-TAG-INCLUDED",
            "key_fingerprint": keyFingerprint if 'keyFingerprint' in locals() else key_fingerprint,
            "digital_signature": f"0x{sig}",
            "timestamp": "2026-03-01T09:30:00Z"
        }

