import fs from 'fs'
import crypto from 'crypto'

// Streams the file through the hash instead of reading it fully into
// memory first — the correct habit regardless of file size, and free
// to do since both pieces are built into Node already.
export const sha256File = (path) => {

    return new Promise((resolve, reject) => {

        const hash = crypto.createHash('sha256')
        const stream = fs.createReadStream(path)

        stream.on('data', (chunk) => hash.update(chunk))
        stream.on('end', () => resolve(hash.digest('hex')))
        stream.on('error', reject)
    })
}