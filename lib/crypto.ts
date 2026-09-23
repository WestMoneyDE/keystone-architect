// AES-256-GCM encrypt/decrypt helpers for secrets at rest (provider API keys).
//
// Serialization format (all hex, colon-joined): `iv:authTag:ciphertext`
//   - iv:         12 random bytes (GCM standard nonce size)
//   - authTag:    16-byte GCM authentication tag, produced on encrypt,
//                 verified on decrypt (throws if the ciphertext was tampered
//                 with or the key is wrong)
//   - ciphertext: the AES-256-GCM output
//
// Key source: process.env.ENCRYPTION_KEY, a 64-char hex string (32 raw
// bytes) — generate your own with `openssl rand -hex 32`. If it is unset,
// a random key is generated once and persisted to storage/encryption.key
// (git-ignored), so a fresh install works without any .env edits. Back that
// file up together with your database — without it, stored API keys cannot
// be decrypted and must simply be re-entered in Settings. We validate the
// key eagerly (on first use, not at import time, so merely importing this
// module in contexts that never call encrypt/decrypt — e.g. type-only
// imports — doesn't crash the process) and throw a clear, actionable error
// rather than letting Node's crypto module fail with an opaque message.

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import fs from "node:fs";
import path from "node:path";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12;
const KEY_LENGTH_BYTES = 32; // AES-256

const KEY_FILE = path.join(process.cwd(), "storage", "encryption.key");

/** Reads (or creates on first use) the local, git-ignored fallback key file. */
function localKeyHex(): string {
  try {
    const existing = fs.readFileSync(KEY_FILE, "utf8").trim();
    if (existing) return existing;
  } catch {
    // not created yet
  }
  const generated = randomBytes(KEY_LENGTH_BYTES).toString("hex");
  fs.mkdirSync(path.dirname(KEY_FILE), { recursive: true });
  fs.writeFileSync(KEY_FILE, `${generated}\n`, { encoding: "utf8", mode: 0o600 });
  return generated;
}

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY || localKeyHex();
  let key: Buffer;
  try {
    key = Buffer.from(raw, "hex");
  } catch {
    throw new Error(
      "ENCRYPTION_KEY is not valid hex. It must be a 64-character hex string " +
        "(32 bytes) — generate one with `openssl rand -hex 32`."
    );
  }
  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error(
      `ENCRYPTION_KEY must decode to exactly ${KEY_LENGTH_BYTES} bytes (64 hex chars), ` +
        `got ${key.length} bytes. Generate a valid key with \`openssl rand -hex 32\`.`
    );
  }
  return key;
}

/** Encrypts `plaintext`, returning the serialized `iv:authTag:ciphertext` hex string. */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

/** Decrypts a string produced by {@link encrypt}. Throws if malformed, tampered, or the key is wrong. */
export function decrypt(serialized: string): string {
  const key = getKey();
  const parts = serialized.split(":");
  if (parts.length !== 3) {
    throw new Error("Malformed ciphertext: expected `iv:authTag:ciphertext` hex format.");
  }
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}
