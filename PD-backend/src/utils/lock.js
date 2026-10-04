import fs from 'fs'

const LOCK_DIR = '/tmp'
const STALE_MS = 2 * 60 * 60 * 1000 // 2 hours — older than this means a crashed run, safe to reclaim

export const acquireLock = (name) => {

    const path = `${LOCK_DIR}/${name}.lock`

    if (fs.existsSync(path)) {

        const age = Date.now() - fs.statSync(path).mtimeMs

        if (age < STALE_MS) {
            return null // a genuinely active run — refuse to start a second one
        }

        fs.unlinkSync(path) // stale lock from a crash — reclaim it
    }

    fs.writeFileSync(path, String(process.pid))

    return path
}

export const releaseLock = (path) => {

    if (path && fs.existsSync(path)) {
        fs.unlinkSync(path)
    }
}