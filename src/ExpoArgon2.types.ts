export type PasswordInput = string | ArrayBuffer | ArrayBufferView;

export enum SaltEncoding {
  UTF8 = "utf8",
  HEX = "hex",
  BASE64 = "base64",
}

export enum Argon2Mode {
  ARGON2_I = "argon2i",
  ARGON2_D = "argon2d",
  ARGON2_ID = "argon2id",
}

export interface Argon2Config {
  /**
   * The computational cost in iterations. 
   * The application should choose this to fit a certain amount of time after fixing the [memory]
   * @default 2
   */
  iterations?: number;
  /**
   * The memory cost in KibiByte (i.e. 1024 byte).
   * @default 32768
   */
  memory?: number;
  /**
   * The factor of parallelism when computing the hash (number of threads).
   * @default 1
   */
  parallelism?: number;
  /**
   * The length of the raw hash in bytes. Defaults to 32.
   * @default 32
   */
  hashLength?: number;
  saltEncoding?: SaltEncoding;
  mode?: Argon2Mode;
}

export interface Argon2Result {
  rawHash: string;
  encodedHash: string;
}
