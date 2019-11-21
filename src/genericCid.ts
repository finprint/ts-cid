/**
 * Factory class for parsing generic CIDs using all known versions.
 */

import BaseCid from './baseCid'
import { BufferStream } from './util'
import CidV1 from './v1'

type ParseFn = (buffer: Buffer, allowMultibasePrefix: boolean) => BaseCid

const SUPPORTED_VERSIONS: { [version: number]: ParseFn } = {
  [CidV1.CID_VERSION]: CidV1.fromBuffer,
}

export default abstract class GenericCid extends BaseCid {
  static fromBuffer(cidBuffer: Buffer, allowMultibasePrefix: boolean = true): BaseCid {
    // Binary-encoded CIDs may have an optional multibase prefix of 0x00.
    if (allowMultibasePrefix && cidBuffer[0] === 0) {
      cidBuffer = cidBuffer.slice(1)
    }

    const cidBytes = new BufferStream(cidBuffer)
    const cidVersion = cidBytes.nextVarint()
    if (cidVersion in SUPPORTED_VERSIONS) {
      return SUPPORTED_VERSIONS[cidVersion](cidBuffer, false)
    } else {
      throw new Error(`Unsupported CID version: ${cidVersion}`)
    }
  }
}
