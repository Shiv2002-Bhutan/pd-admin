import fs from 'fs'
import pool from '../config/db.js'
//import { sha256File } from '../utils/checksum.js'
import { acquireLock, releaseLock } from '../utils/lock.js'

const run = async () => {

    const lockPath = acquireLock('delete-archived-period')

    if (!lockPath) {
        console.error('Another deletion job is already running. Exiting.')
        process.exit(1)
    }

    // A single dedicated client for the whole transaction — BEGIN, both
    // DELETEs, and COMMIT are now guaranteed to run on the SAME connection.
    // The earlier version used pool.query() per statement, which borrows a
    // connection independently each time — meaning BEGIN and the DELETEs
    // could silently land on different connections, running outside any
    // real transaction with no rollback safety net.
    const client = await pool.connect()

    try {

        const now = new Date()

    //test date
    //     const now = process.env.ARCHIVE_TEST_DATE
    // ? new Date(process.env.ARCHIVE_TEST_DATE)
    // : new Date()

        const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        // const result = await client.query(
        //     `SELECT * FROM pos_archives
        //      WHERE period_start = $1 AND pdf_status = 'created' AND deletion_status = 'pending'`,
        //     [periodStart]
        // )



const result = await client.query(
    `SELECT * FROM pos_archives
     WHERE period_start = $1
       AND pdf_status = 'created'
       AND deletion_status = 'pending'
       AND downloaded_at IS NOT NULL`,
    [periodStart]
)


        const archive = result.rows[0]

        if (!archive) {
            console.log('No pending archive to verify for this period. Nothing deleted.')
            return
        }

        const path = `${process.env.ARCHIVE_DIR}/${archive.filename}`

        if (!fs.existsSync(path)) {
            console.error('Archive file missing on disk. Aborting — live data NOT deleted.')
            return
        }

        // //const actualChecksum = await sha256File(path)

        // if (actualChecksum !== archive.checksum) {
        //     console.error('Checksum mismatch. Aborting — live data NOT deleted.')
        //     process.exit(1)
        // }

        await client.query('BEGIN')

        await client.query(
            `DELETE FROM sale_items WHERE sale_id IN (
                SELECT id FROM sales WHERE created_at >= $1 AND created_at < $2
            )`,
            [archive.period_start, nextMonthStart]
        )

        await client.query(
            'DELETE FROM sales WHERE created_at >= $1 AND created_at < $2',
            [archive.period_start, nextMonthStart]
        )

        await client.query(
            `UPDATE pos_archives SET deletion_status = 'deleted', deleted_at = now() WHERE id = $1`,
            [archive.id]
        )

        await client.query('COMMIT')

        console.log(`Live data for ${archive.period_start} deleted after verification.`)
        return

    } catch (error) {

        await client.query('ROLLBACK').catch(() => {})
        console.error('Deletion aborted:', error)
        return

    } finally {

        
        client.release()
        releaseLock(lockPath)
    }
}

run()