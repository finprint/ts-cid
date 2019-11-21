/**
 * Abstract base class for a Finprint CID.
 *
 * Encoding and decoding logic should be implemented in version-specific classes inheriting from BaseCid.
 */

import * as multibase from 'multibase'
import * as multicodec from 'multicodec'

import * as tables from './tables'

export default abstract class BaseCid {
  static readonly STORAGE_METHOD = tables.STORAGE_METHOD
  static readonly ENCRYPTION_METHOD = tables.ENCRYPTION_METHOD
  static readonly CONTENT_ENCODING = { ...multicodec, ...multicodec.print }

  protected _buffer?: Buffer // Cached buffer representation.

  readonly cidVersion: number
  readonly storageMethod: number
  readonly encryptionMethod: number
  readonly contentEncoding: number
  readonly storageKey: Buffer
  readonly decryptionKey: Buffer

  protected constructor(
    cidVersion: number,
    storageMethod: number,
    encryptionMethod: number,
    contentEncoding: number,
    storageKey: Buffer,
    decryptionKey: Buffer,
  ) {
    this.cidVersion = cidVersion
    this.storageMethod = storageMethod
    this.encryptionMethod = encryptionMethod
    this.contentEncoding = contentEncoding
    this.storageKey = storageKey
    this.decryptionKey = decryptionKey
  }

  static fromString(multibaseCid: string): BaseCid {
    let cidBuffer = multibase.decode(multibaseCid) as Buffer
    return this.fromBuffer(cidBuffer, false)
  }

  static fromBuffer(_cidBuffer: Buffer, _allowMultibasePrefix: boolean): BaseCid {
    throw new Error('fromBuffer not implemented')
  }

  validate(): void {
    if (!BaseCid.STORAGE_METHOD[this.storageMethod]) {
      throw new Error(`Unknown storage method: ${this.storageMethod}`)
    }
    if (!BaseCid.ENCRYPTION_METHOD[this.encryptionMethod]) {
      throw new Error(`Unknown encryption method ${this.encryptionMethod}`)
    }
    if (!BaseCid.CONTENT_ENCODING[this.contentEncoding]) {
      throw new Error(`Unknown content encoding: ${this.contentEncoding}`)
    }
    const expectedKeyLength = tables.DECRYPTION_KEY_LENGTH[this.encryptionMethod]
    if (this.decryptionKey.length != expectedKeyLength) {
      throw new Error(`Expected decryption key to have length ${expectedKeyLength} but it was ${this.decryptionKey.length}`)
    }
  }

  abstract get buffer(): Buffer
}
