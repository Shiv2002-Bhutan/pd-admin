import fs from 'fs'
import { execFileSync } from 'child_process'
import pool from '../config/db.js'
import { generateReportPdf } from '../services/pdfService.js'
import { sha256File } from '../utils/checksum.js'
import { acquireLock, releaseLock } from '../utils/lock.js'

const run = async () => {

    const lockPath = acquireLock('create-archive')

    if (!lockPath) {
        console.error('Another archive job is already running. Exiting.')
        process.exit(1)
    }

    try {

        const archiveDir = process.env.ARCHIVE_DIR
        fs.mkdirSync(archiveDir, { recursive: true })

       const now = new Date()


       //test date 
    //    const now = process.env.ARCHIVE_TEST_DATE
    // ? new Date(process.env.ARCHIVE_TEST_DATE)
    // : new Date()

        // Half-open interval [periodStart, nextMonthStart) — fixes the
        // earlier bug where "<= last day at 00:00" silently dropped any
        // sale made after midnight on the final day of the month.
        const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const periodEndDisplay = new Date(now.getFullYear(), now.getMonth(), 0)

        const periodLabel =
            `${periodStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ` +
            `${periodEndDisplay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`

        const detailResult = await pool.query(
            `SELECT sales.id AS sale_id, sales.created_at, sale_items.name,
                    sale_items.price, sale_items.quantity, sale_items.subtotal
             FROM sales
             JOIN sale_items ON sale_items.sale_id = sales.id
             WHERE sales.created_at >= $1 AND sales.created_at < $2
             ORDER BY sales.created_at ASC`,
            [periodStart, nextMonthStart]
        )

        const summaryResult = await pool.query(
            `SELECT COUNT(DISTINCT sales.id) AS total_sales, COALESCE(SUM(sales.total), 0) AS total_amount
             FROM sales
             WHERE sales.created_at >= $1 AND sales.created_at < $2`,
            [periodStart, nextMonthStart]
        )

        const summary = summaryResult.rows[0]

        const rows = detailResult.rows.map((r) => ({
            date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            saleId: r.sale_id,
            name: r.name,
            qty: r.quantity,
            price: r.price,
            subtotal: r.subtotal
        }))

        const baseName = `pd_sales_${periodStart.toISOString().slice(0, 7)}`
        const plainPath = `/tmp/${baseName}.plain.pdf`
        const finalFilename = `${baseName}.pdf`
        const finalPath = `${archiveDir}/${finalFilename}`

        let pdfStatus = 'failed'
        let checksum = null

        try {

            await generateReportPdf(plainPath, {
                periodLabel,
                rows,
                totalAmount: summary.total_amount
            })

            const passphrase = process.env.ARCHIVE_PASSPHRASE

            execFileSync('qpdf', [
                '--encrypt', passphrase, passphrase, '256',
                '--', plainPath, finalPath
            ])

            fs.unlinkSync(plainPath)

            checksum = await sha256File(finalPath)
            pdfStatus = 'created'

        } catch (error) {

            console.error('PDF generation/encryption failed:', error)

            if (fs.existsSync(plainPath)) fs.unlinkSync(plainPath)
        }

        await pool.query(
            `INSERT INTO pos_archives
                (period_start, period_end, filename, checksum, total_sales, total_amount, pdf_status, file_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'present')`,
            [periodStart, periodEndDisplay, finalFilename, checksum || '', summary.total_sales, summary.total_amount, pdfStatus]
        )

        if (pdfStatus !== 'created') {
            console.error('Archive creation failed this month. Nothing evicted.')
            process.exit(1)
        }

        console.log(`Archive created: ${finalFilename}`)

        // ===== FIFO eviction — download-gated =====
        // The oldest "present" archive is only evicted once it has actually
        // been downloaded. If not, it's left in place (temporarily exceeding
        // 3) rather than silently destroying a report nobody has saved yet.
        // A corrupt/missing file is the one exception — there's nothing left
        // to preserve, so its record is removed regardless of download status.

        const presentArchives = await pool.query(
            `SELECT * FROM pos_archives WHERE file_status = 'present' ORDER BY period_start ASC`
        )

        if (presentArchives.rows.length > 3) {

            const oldest = presentArchives.rows[0]
            const oldestPath = `${archiveDir}/${oldest.filename}`
            const fileExists = fs.existsSync(oldestPath)
            const checksumOk = fileExists && (await sha256File(oldestPath)) === oldest.checksum

            if (!fileExists || !checksumOk) {

                console.error(
                    `Archive for ${oldest.period_start} is missing or corrupted — ` +
                    `cannot be downloaded regardless, removing its record.`
                )

                if (fileExists) fs.unlinkSync(oldestPath)

                await pool.query('DELETE FROM pos_archives WHERE id = $1', [oldest.id])

            } else if (!oldest.downloaded_at) {

                console.warn(
                    `Eviction deferred for ${oldest.period_start}: not yet downloaded. ` +
                    `Archive count temporarily exceeds 3 until it is.`
                )

            } else {

                fs.unlinkSync(oldestPath)

                await pool.query('DELETE FROM pos_archives WHERE id = $1', [oldest.id])

                console.log(`Evicted archive for ${oldest.period_start} (downloaded, FIFO limit reached).`)
            }
        }

        process.exit(0)

    } 
    finally {

        releaseLock(lockPath)
        
    }
}

run().catch((error) => {
    console.error('Archive job failed:', error)
    process.exit(1)
})