import CryptoJS from 'crypto-js';

export function generateMD5(text: string): string {
  return CryptoJS.MD5(text).toString();
}

export function generateSHA1(text: string): string {
  return CryptoJS.SHA1(text).toString();
}

export function generateSHA256(text: string): string {
  return CryptoJS.SHA256(text).toString();
}

export function generateSHA512(text: string): string {
  return CryptoJS.SHA512(text).toString();
}

export function generateAllHashes(text: string) {
  return {
    md5: generateMD5(text),
    sha1: generateSHA1(text),
    sha256: generateSHA256(text),
    sha512: generateSHA512(text),
  };
}
