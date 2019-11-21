import chai from 'chai'

import { Cid, CidV1 } from '../src'

const expect = chai.expect

/**
 * Test data.
 */
const cidBuf = Buffer.from('QQABgAQTeyJkYXRhIjogImV4YW1wbGUifUBsV1vSSn7S6LSC9suRcVhhRPw8iZ/aO9dJRd4oA2P0guknmlqrC18Ik6/n12SnTg5PUjYxSkVD7VuRX3wri8k=', 'base64')
const inlineData = Buffer.from('{"data": "example"}', 'utf8')
const key = Buffer.from('406c575bd24a7ed2e8b482f6cb9171586144fc3c899fda3bd74945de280363f482e9279a5aab0b5f0893afe7d764a74e0e4f5236314a4543ed5b915f7c2b8bc9', 'hex')
const cidBufNoEncryption = Buffer.from('QQAAgAQTeyJkYXRhIjogImV4YW1wbGUifQ==', 'base64')

describe('Finprint CID v1', () => {
  it('creates a CID from parts', () => {
    const cid = CidV1.fromComponents(
      Cid.STORAGE_METHOD.INLINE,
      Cid.ENCRYPTION_METHOD.AES_256_CBC,
      Cid.CONTENT_ENCODING.JSON,
      inlineData,
      key,
    )
    cid.validate()

    expect(cid.cidVersion).to.equal(0x41, 'version')
    expect(cid.contentEncoding).to.equal(Cid.CONTENT_ENCODING.JSON, 'content encoding')
    expect(cid.storageKey).to.deep.equal(inlineData, 'storage key (inline data)')
    expect(cid.storageMethod).to.equal(Cid.STORAGE_METHOD.INLINE, 'storage method')
    expect(cid.encryptionMethod).to.equal(Cid.ENCRYPTION_METHOD.AES_256_CBC, 'encryption method')
    expect(cid.decryptionKey).to.deep.equal(key, 'decryption key')

    expect(cid.buffer).to.deep.equal(cidBuf, 'buffer representation')
  })

  it('creates a CID from parts, without encryption', () => {
    const cid = CidV1.fromComponents(
      Cid.STORAGE_METHOD.INLINE,
      Cid.ENCRYPTION_METHOD.NO_ENCRYPTION,
      Cid.CONTENT_ENCODING.JSON,
      inlineData,
    )
    cid.validate()

    expect(cid.cidVersion).to.equal(0x41, 'version')
    expect(cid.contentEncoding).to.equal(Cid.CONTENT_ENCODING.JSON, 'content encoding')
    expect(cid.storageKey).to.deep.equal(inlineData, 'storage key (inline data)')
    expect(cid.storageMethod).to.equal(Cid.STORAGE_METHOD.INLINE, 'storage method')
    expect(cid.encryptionMethod).to.equal(Cid.ENCRYPTION_METHOD.NO_ENCRYPTION, 'encryption method')
    expect(cid.decryptionKey).to.deep.equal(Buffer.from([]), 'decryption key')

    expect(cid.buffer).to.deep.equal(cidBufNoEncryption, 'buffer representation')
  })

  it('parses a hex-encoded CID', () => {
    const cidStr = 'f' + cidBuf.toString('hex') // Hex string with multibase prefix.
    const cid = Cid.fromString(cidStr)
    cid.validate()

    expect(cid.cidVersion).to.equal(0x41, 'version')
    expect(cid.contentEncoding).to.equal(Cid.CONTENT_ENCODING.JSON, 'content encoding')
    expect(cid.storageKey).to.deep.equal(inlineData, 'storage key (inline data)')
    expect(cid.storageMethod).to.equal(Cid.STORAGE_METHOD.INLINE, 'storage method')
    expect(cid.encryptionMethod).to.equal(Cid.ENCRYPTION_METHOD.AES_256_CBC, 'encryption method')
    expect(cid.decryptionKey).to.deep.equal(key, 'decryption key')

    expect(cid.buffer).to.deep.equal(cidBuf, 'buffer representation')
  })

  it('parses a binary CID', () => {
    const cid = Cid.fromBuffer(cidBuf)
    cid.validate()

    expect(cid.cidVersion).to.equal(0x41, 'version')
    expect(cid.contentEncoding).to.equal(Cid.CONTENT_ENCODING.JSON, 'content encoding')
    expect(cid.storageKey).to.deep.equal(inlineData, 'storage key (inline data)')
    expect(cid.storageMethod).to.equal(Cid.STORAGE_METHOD.INLINE, 'storage method')
    expect(cid.encryptionMethod).to.equal(Cid.ENCRYPTION_METHOD.AES_256_CBC, 'encryption method')
    expect(cid.decryptionKey).to.deep.equal(key, 'decryption key')

    expect(cid.buffer).to.deep.equal(cidBuf, 'buffer representation')
  })

  it('parses a binary CID, without encryption', () => {
    const cid = Cid.fromBuffer(cidBufNoEncryption)
    cid.validate()

    expect(cid.cidVersion).to.equal(0x41, 'version')
    expect(cid.contentEncoding).to.equal(Cid.CONTENT_ENCODING.JSON, 'content encoding')
    expect(cid.storageKey).to.deep.equal(inlineData, 'storage key (inline data)')
    expect(cid.storageMethod).to.equal(Cid.STORAGE_METHOD.INLINE, 'storage method')
    expect(cid.encryptionMethod).to.equal(Cid.ENCRYPTION_METHOD.NO_ENCRYPTION, 'encryption method')
    expect(cid.decryptionKey).to.deep.equal(Buffer.from([]), 'decryption key')

    expect(cid.buffer).to.deep.equal(cidBufNoEncryption, 'buffer representation')
  })

  it('parses a multibase-prefixed binary CID', () => {
    // 0x00 is the multibase prefix for binary data.
    // The prefix is optional for data that is unambiguously in raw binary format.
    const cid = Cid.fromBuffer(Buffer.concat([
      Buffer.from('00', 'hex'),
      cidBuf,
    ]))
    cid.validate()
  })

  it('fails if the data within a multibase text-encoded CID starts with 0x00', () => {
    // This is like using two multibase prefixes on top of each other, and should not be allowed.
    const cidBuf2 = Buffer.concat([
      Buffer.from('00', 'hex'),
      cidBuf,
    ])
    const cidStr = 'f' + cidBuf2.toString('hex')
    expect(() => Cid.fromString(cidStr)).to.throw('Unsupported CID version: 0')
  })

  it('fails validation if the storage method is unknown', () => {
    const cid = CidV1.fromComponents(
      10,
      Cid.ENCRYPTION_METHOD.NO_ENCRYPTION,
      Cid.CONTENT_ENCODING.JSON,
      inlineData,
    )
    expect(() => cid.validate()).to.throw('Unknown storage method: 10')
  })

  it('fails validation if a key is expected but not present', () => {
    const cid = CidV1.fromComponents(
      Cid.STORAGE_METHOD.INLINE,
      Cid.ENCRYPTION_METHOD.AES_256_CBC,
      Cid.CONTENT_ENCODING.JSON,
      inlineData,
    )
    expect(() => cid.validate()).to.throw('Expected decryption key to have length 64 but it was 0')
  })
})
