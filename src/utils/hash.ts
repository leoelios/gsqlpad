import crypto from "crypto";

export function hash(length: number): string {
  const randomBytes = crypto.randomBytes(length);
  const hash = crypto.createHash("sha256").update(randomBytes).digest("hex");
  return hash.substring(0, length);
}
