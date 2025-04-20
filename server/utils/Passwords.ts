const SALT_LENGTH = 16; // Length of salt in bytes
const ITERATIONS = 100000; // Number of iterations
const KEY_LENGTH = 256; // Length of the derived key (in bits, so 256 bits = 32 bytes)
const DIGEST = 'SHA-512'; // Hash algorithm

/**
 * Hashes a password with a random salt using Web Crypto API.
 * @param password - The password to hash.
 * @returns A promise that resolves to the hashed password and the salt.
 */
export async function hashPassword(password: string): Promise<{ hash: string, salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH)); // Generate a random salt
  
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const key = await crypto.subtle.importKey(
    'raw', 
    passwordBuffer, 
    { name: 'PBKDF2' }, 
    false, 
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    key,
    KEY_LENGTH * 8 // Key length in bits
  );

  const derivedKey = new Uint8Array(derivedBits);
  const hash = Array.from(derivedKey).map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Convert the salt to a hex string for storage
  const saltHex = Array.from(salt).map(byte => byte.toString(16).padStart(2, '0')).join('');

  return { hash, salt: saltHex };
}

/**
 * Verifies a password by comparing it with a hashed password.
 * @param password - The password to verify.
 * @param hash - The hashed password to compare against.
 * @param salt - The salt used during hashing.
 * @returns A promise that resolves to true if the password matches, otherwise false.
 */
export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const saltBuffer = new Uint8Array(salt.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []);
  
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const key = await crypto.subtle.importKey(
    'raw', 
    passwordBuffer, 
    { name: 'PBKDF2' }, 
    false, 
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: DIGEST,
    },
    key,
    KEY_LENGTH * 8 // Key length in bits
  );

  const derivedKey = new Uint8Array(derivedBits);
  const derivedHash = Array.from(derivedKey).map(byte => byte.toString(16).padStart(2, '0')).join('');

  return derivedHash === hash;
}
