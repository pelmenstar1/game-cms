import { hash, type Options, verify } from '@node-rs/argon2';

const options: Options = {
  algorithm: 2, // Algorithm.Argon2id
  version: 1, // Version.V0x13
};

export function hashPassword(text: string): Promise<string> {
  return hash(text, options);
}

export function verifyPassword(hash: string, password: string) {
  return verify(hash, password, options);
}
