// Short, URL-friendly id generator (~22 chars).
// Avoids pulling in nanoid as a dep; Web Crypto is available in Node 19+ and edge.
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function createId(size = 22): string {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < size; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}
