import {
  scrypt as _scrypt,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(_scrypt);
const KEYLEN = 64;

// ── Passwords ───────────────────────────────────────────────────────────────
// scrypt with a per-password random salt. Stored as "salt:hash" (hex). scrypt
// is in Node core, so there's no native-module dependency to break on Vercel.

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scrypt(password.normalize(), salt, KEYLEN)) as Buffer;
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scrypt(password.normalize(), salt, KEYLEN)) as Buffer;
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

// ── Recovery codes ──────────────────────────────────────────────────────────
// High-entropy one-time codes shown once at signup. Only sha256 hashes are
// stored (sha256 is fine here — the codes are random, not user-chosen).

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function randomCode(): string {
  const bytes = randomBytes(10);
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    if (i === 4) out += "-";
  }
  return out; // e.g. "AB3CD-EF7GH"
}

export function hashRecoveryCode(code: string): string {
  return createHash("sha256")
    .update(code.trim().toUpperCase().replace(/\s+/g, ""))
    .digest("hex");
}

export function generateRecoveryCodes(count = 8): {
  plain: string[];
  hashes: string[];
} {
  const plain = Array.from({ length: count }, randomCode);
  return { plain, hashes: plain.map(hashRecoveryCode) };
}

// ── Tokens ──────────────────────────────────────────────────────────────────

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

// A readable temporary password for approver-issued Community Password Resets.
export function generateTempPassword(): string {
  const bytes = randomBytes(9);
  let out = "";
  for (let i = 0; i < 9; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
    if (i === 2 || i === 5) out += "-";
  }
  return out;
}
