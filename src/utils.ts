import { PasswordInput } from "./ExpoArgon2.types";

// native modules require password to be either String or Uint8Array
// but we want to support any binary format
export function ensurePasswordFormat(password: PasswordInput): string | Uint8Array {
  if (typeof password === 'string') {
    return password;
  }

  if (password instanceof Uint8Array) {
    return password;
  }

  if (password instanceof ArrayBuffer) {
    return new Uint8Array(password);
  }

  if (ArrayBuffer.isView(password)) {
    return new Uint8Array(password.buffer);
  }

  throw new Error('invalid password input type');
}
