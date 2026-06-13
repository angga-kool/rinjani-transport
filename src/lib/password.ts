/**
 * Secure password hashing using PBKDF2 via Web Crypto API.
 * Much more secure than raw SHA-256 — includes salt and iterations.
 * No native dependencies needed (works in Node.js, Edge, and browser).
 */

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // 256 bits
const ALGORITHM = "PBKDF2";
const HASH_ALGORITHM = "SHA-256";

/**
 * Hash a password with PBKDF2 and a random salt.
 * Returns format: `pbkdf2:iterations:salt:hash` (all hex-encoded)
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    ALGORITHM,
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const hashHex = bufferToHex(new Uint8Array(derivedBits));
  const saltHex = bufferToHex(salt);

  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a stored hash.
 * Supports both new PBKDF2 format and legacy SHA-256 format for migration.
 */
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  // New PBKDF2 format: "pbkdf2:iterations:salt:hash"
  if (storedHash.startsWith("pbkdf2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 4) return false;

    const iterations = parseInt(parts[1]);
    const salt = hexToBuffer(parts[2]);
    const expectedHash = parts[3];

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      ALGORITHM,
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: ALGORITHM,
        salt: salt.buffer as ArrayBuffer,
        iterations,
        hash: HASH_ALGORITHM,
      },
      keyMaterial,
      KEY_LENGTH * 8
    );

    const computedHash = bufferToHex(new Uint8Array(derivedBits));
    return timingSafeEqual(computedHash, expectedHash);
  }

  // Legacy SHA-256 format (plain hex hash, no prefix)
  // This supports existing passwords until they are migrated
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hash = bufferToHex(new Uint8Array(hashBuffer));
  return timingSafeEqual(hash, storedHash);
}

// --- Utility functions ---

function bufferToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
