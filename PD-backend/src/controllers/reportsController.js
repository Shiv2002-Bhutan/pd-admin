import fs from 'fs'
import path from 'path'
import pool from '../config/db.js'

export const getArchives = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM pos_archives
             ORDER BY period_start DESC`
        )

        res.json(result.rows)
    } catch (error) {
        console.error('Get archives error:', error)

        res.status(500).json({
            message: 'Failed to fetch reports.'
        })
    }
}

export const downloadArchive = async (req, res) => {
    const { id } = req.params

    try {
        const result = await pool.query(
            `SELECT *
             FROM pos_archives
             WHERE id = $1`,
            [id]
        )

        const archive = result.rows[0]

        if (!archive) {
            return res.status(404).json({
                message: 'Report not found.'
            })
        }

        if (archive.file_status === 'evicted') {
            return res.status(410).json({
                message: 'This report has been permanently removed.'
            })
        }

        const archiveDir = process.env.ARCHIVE_DIR

        if (!archiveDir) {
            console.error('ARCHIVE_DIR is not configured.')

            return res.status(500).json({
                message: 'Archive storage is not configured.'
            })
        }

        // Strip any directory components to prevent path traversal
        const safeFilename = path.basename(archive.filename)
        const filePath = path.join(archiveDir, safeFilename)

        console.log('Archive download:', { archiveDir, filename: safeFilename, filePath })

        if (!fs.existsSync(filePath)) {
            console.error(`Archive file missing: ${filePath}`)

            return res.status(404).json({
                message: 'Archive file missing on server.'
            })
        }

        // Mark as downloaded only after Express reports that
        // the file transfer completed without an error.
        return res.download(filePath, safeFilename, async (error) => {
            if (error) {
                console.error('Archive download failed:', error)
                return
            }

            try {
                await pool.query(
                    `UPDATE pos_archives
                     SET downloaded_at = COALESCE(downloaded_at, now())
                     WHERE id = $1`,
                    [id]
                )

                console.log(`Archive ${safeFilename} downloaded successfully.`)
            } catch (dbError) {
                console.error(
                    'Download completed, but failed to record download status:',
                    dbError
                )
            }
        })
    } catch (error) {
        console.error('Download archive error:', error)

        if (!res.headersSent) {
            res.status(500).json({
                message: 'Failed to download archive.'
            })
        }
    }
}