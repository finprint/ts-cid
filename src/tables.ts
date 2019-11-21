/**
 * Tables enumerating storage and encryption methods supported by Finprint.
 */

export enum STORAGE_METHOD {
  /** Indicates that the storage key field constitutes the stored data itself. */
  'INLINE' = 0,
}

export enum ENCRYPTION_METHOD {
  /** Data is unencrypted. */
  'NO_ENCRYPTION' = 0,

  /**
   * Data is encrypted with AES-256 in CBC mode.
   *
   * Decryption key is the 32-byte key concatenated with the 32-byte IV.
   */
  'AES_256_CBC' = 1,

  /**
   * Data is encrypted with AES-256 in CBC mode with IV=0.
   *
   * Decryption key is the 32-byte key.
   */
  'AES_256_CBC_IV_0' = 2,
}

/**
 * Mapping from encryption method enum to the decryption key length in bytes.
 */
export const DECRYPTION_KEY_LENGTH: { [index: number]: number } = {
  0: 0,
  1: 64,
  2: 32,
}
