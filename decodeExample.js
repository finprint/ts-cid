// Usage: node decodeExample.js

const { Cid } = require('./dist/src')

const cid = Cid.fromString('f4100028004137b2264617461223a20226578616d706c65227daaaaaaaabbbbbbbbccccccccdddddddd')

console.log(cid)
console.log()
console.log('Storage method:', Cid.STORAGE_METHOD[cid.storageMethod])
console.log('Encryption method:', Cid.ENCRYPTION_METHOD[cid.encryptionMethod])
console.log('Content encoding:', Cid.CONTENT_ENCODING[cid.contentEncoding])
