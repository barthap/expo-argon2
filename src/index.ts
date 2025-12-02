// Reexport the native module. On web, it will be resolved to ExpoArgon2Module.web.ts
// and on native platforms to ExpoArgon2Module.ts
import { Argon2Config, Argon2Result, SaltEncoding } from './ExpoArgon2.types';
import Argon2Module from './ExpoArgon2Module';

export * from './ExpoArgon2.types';

/**
 * Hashes a given `Data` password with Argon2 utilizing the given salt as well as optionally the specific parameters of the hashing operation itself.
 *
 * @param password The password to hash
 * @param salt The salt to use with Argon2 as the salt in the hashing operation. Minimum salt length is 8 bytes.
 * @param config Optional configuration of the hashing operation.
 * @returns an object containing both `rawHash` and `encodedHash` versions of the hash.
 */
export async function hashAsync(
  password: string,
  salt: string,
  config: Argon2Config = {}
): Promise<Argon2Result> {
  const saltByteLength = config.saltEncoding === SaltEncoding.HEX
    // in hex, 1 byte is encoded by 2 characters
    ? salt.length / 2
    : salt.length;

  if (saltByteLength < 8) {
    throw new Error("Argon2: Salt must be at least 8 bytes long")
  }
  return Argon2Module.hashStringAsync(password, salt, config);
}

export default {
  hashAsync
}
