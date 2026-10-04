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

        const filePath = path.join(
            archiveDir,
            archive.filename
        )

        console.log('Archive download:')
        console.log('Directory:', archiveDir)
        console.log('Filename:', archive.filename)
        console.log('Path:', filePath)

        if (!fs.existsSync(filePath)) {

            console.error(
                `Archive file missing: ${filePath}`
            )

            return res.status(404).json({
                message: 'Archive file missing on server.'
            })
        }

        /*
         * Mark as downloaded only after confirming
         * that the actual archive exists.
         */
        await pool.query(
            `UPDATE pos_archives
             SET downloaded_at = COALESCE(downloaded_at, now())
             WHERE id = $1`,
            [id]
        )

        return res.download(
            filePath,
            archive.filename,
            (error) => {

                if (error) {
                    console.error(
                        'Archive download error:',
                        error
                    )
                }
            }
        )

    } catch (error) {

        console.error(
            'Download archive error:',
            error
        )

        if (!res.headersSent) {

            res.status(500).json({
                message: 'Failed to download archive.'
            })
        }
    }
}