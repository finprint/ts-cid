import * as varint from 'varint'

export class BufferStream {
  private _buffer: Buffer

  constructor(buffer: Buffer) {
    this._buffer = buffer
  }

  get buffer(): Buffer {
    return this._buffer
  }

  get length(): number {
    return this._buffer.length
  }

  nextVarint(): number {
    const int = varint.decode(this._buffer)
    this._buffer = this._buffer.slice(varint.decode.bytes)
    return int
  }

  nextBytes(numBytes: number): Buffer {
    const bytes = this._buffer.slice(0, numBytes)
    this._buffer = this._buffer.slice(numBytes)
    return bytes
  }

  isEmpty(): boolean {
    return this._buffer.length === 0
  }
}
