/**
 * Encodes and decode CIDs according to the Finprint CID v1 spec.
 */

import * as varint from 'varint'

import BaseCid from './baseCid'
import * as tables from './tables'
import { BufferStream } from './util'

export default class CidV1 extends BaseCid {
  static readonly CID_VERSION = 0x41

  public static fromComponents(
    storageMethod: number,
    encryptionMethod: number,
    contentEncoding: number,
    storageKey: Buffer,
    decryptionKey: Buffer = Buffer.from([]),
  ) {
    return new CidV1(CidV1.CID_VERSION, storageMethod, encryptionMethod, contentEncoding, storageKey, decryptionKey)
  }

  public static fromBuffer(cidBuffer: Buffer, allowMultibasePrefix: boolean = true): CidV1 {
    // Binary-encoded CIDs may have an optional multibase prefix of 0x00.
    if (allowMultibasePrefix && cidBuffer[0] === 0) {
      cidBuffer = cidBuffer.slice(1)
    }

    const cidBytes = new BufferStream(cidBuffer)
    const cidVersion = cidBytes.nextVarint()
    if (cidVersion !== CidV1.CID_VERSION) {
      throw new Error(`CidV1 parser expected CID version ${CidV1.CID_VERSION} but found ${cidVersion}`)
    }
    const storageMethod = cidBytes.nextVarint()
    const encryptionMethod = cidBytes.nextVarint()
    const contentEncoding = cidBytes.nextVarint()
    const storageKeyLength = cidBytes.nextVarint()
    const storageKey = cidBytes.nextBytes(storageKeyLength)
    const decryptionKey = cidBytes.nextBytes(tables.DECRYPTION_KEY_LENGTH[encryptionMethod])
    return CidV1.fromComponents(storageMethod, encryptionMethod, contentEncoding, storageKey, decryptionKey)
  }

  get buffer(): Buffer {
    if (!this._buffer) {
      this._buffer = Buffer.concat([
        Buffer.from(varint.encode(this.cidVersion)),
        Buffer.from(varint.encode(this.storageMethod)),
        Buffer.from(varint.encode(this.encryptionMethod)),
        Buffer.from(varint.encode(this.contentEncoding)),
        Buffer.from(varint.encode(this.storageKey.length)),
        this.storageKey,
        this.decryptionKey,
      ])
    }
    return this._buffer
  }
}
