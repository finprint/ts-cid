// Usage: node encodeExample.js

const { Cid, CidV1 } = require('./dist/src')

const inlineData = Buffer.from('{"data": "example"}', 'utf8')
const decryptionKey = Buffer.from('aaaaaaaabbbbbbbbccccccccdddddddd', 'hex')
const cid = CidV1.fromComponents(
  Cid.STORAGE_METHOD.INLINE,
  Cid.ENCRYPTION_METHOD.AES_256_CBC_IV_0,
  Cid.CONTENT_ENCODING.JSON,
  inlineData,
  decryptionKey,
)
console.log('CID as multibase hex string:')
console.log('f' + cid.buffer.toString('hex'))
