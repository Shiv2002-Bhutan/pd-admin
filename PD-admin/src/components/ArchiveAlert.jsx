import React, { useEffect, useState } from 'react'
import { AlertTriangle, Download } from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { getArchives, downloadArchivePdf } from '../services/api'

const triggerDownload = (blob, filename) => {

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}

const ArchiveAlert = () => {

    const { user } = useAuth()

    const [pending, setPending] = useState(null)
    const [downloading, setDownloading] = useState(false)

    const checkPending = async () => {

        if (user?.role !== 'super_admin') return

        try {

            const archives = await getArchives()

            const candidates = archives
                .filter((a) => a.pdf_status === 'created' && a.file_status === 'present' && !a.downloaded_at)
                .sort((a, b) => new Date(a.period_start) - new Date(b.period_start))

            setPending(candidates[0] || null)

        } catch (err) {

            console.error(err)
        }
    }

    useEffect(() => {

        checkPending()

    }, [user])

    if (!pending) return null

    const isLiveDataGone = pending.deletion_status === 'deleted'

    const formatPeriod = (start) =>
        new Date(start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    const handleDownload = async () => {

        setDownloading(true)

        try {

            const blob = await downloadArchivePdf(pending.id)

            triggerDownload(blob, `PD_Sales_Report_${pending.period_start.slice(0, 7)}.pdf`)

            setPending(null)

        } catch (err) {

            console.error(err)

        } finally {

            setDownloading(false)
        }
    }

    return (
        <div className="sticky top-0 z-[60] bg-red-600 text-white shadow-lg">

            <div className="
                px-5
                py-3.5
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3
            ">

                <div className="flex items-center gap-3">

                    <AlertTriangle
                        size={isLiveDataGone ? 20 : 17}
                        strokeWidth={1.5}
                        className="flex-shrink-0 animate-pulse"
                    />

                    <p className={isLiveDataGone ? 'text-sm font-medium' : 'text-sm'}>

                        {isLiveDataGone ? (

                            <>
                                <span className="font-semibold underline underline-offset-2">
                                    URGENT — Report for {formatPeriod(pending.period_start)} is the only remaining copy.
                                </span>{' '}
                                Live data has already been permanently removed from the database.
                            </>

                        ) : (

                            <>
                                <span className="font-semibold">
                                    Report for {formatPeriod(pending.period_start)} has not been downloaded.
                                </span>{' '}
                                Older reports are only removed once replaced by a new one — but only after being downloaded. Please download it to keep a copy.
                            </>

                        )}

                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-white
                        text-red-600
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        hover:bg-red-50
                        transition
                        disabled:opacity-60
                        whitespace-nowrap
                        flex-shrink-0
                    "
                >
                    <Download size={13} strokeWidth={2} />
                    {downloading ? 'Downloading...' : 'Download Now'}
                </button>

            </div>

        </div>
    )
}

export default ArchiveAlert