import React, { useState, useEffect } from 'react'
import { FileText, Download } from 'lucide-react'

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

const Reports = () => {

    const [archives, setArchives] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [downloadingId, setDownloadingId] = useState(null)

    const fetchArchives = async (silent = false) => {

        if (!silent) setLoading(true)
        setError('')

        try {

            const data = await getArchives()

            setArchives(data)

        } catch (err) {

            console.error(err)
            setError('Could not load reports.')

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        fetchArchives()

    }, [])

    const formatPeriod = (start) =>
        new Date(start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Hide evicted reports, newest first
    const visibleArchives = archives
        .filter((archive) => archive.file_status !== 'evicted')
        .sort((a, b) => new Date(b.period_start) - new Date(a.period_start))

    const handleDownload = async (archive) => {

        setDownloadingId(archive.id)

        try {

            const blob = await downloadArchivePdf(archive.id)

            triggerDownload(blob, `PD_Sales_Report_${archive.period_start.slice(0, 7)}.pdf`)

            fetchArchives(true) // silent refresh so downloaded_at updates without a loading flash

        } catch (err) {

            console.error(err)
            alert(err.message)

        } finally {

            setDownloadingId(null)
        }
    }

    return (
        <div className="w-full">

            <div className="mb-8">

                <div className="inline-flex items-center gap-2 mb-2">
                    <p className="text-gray-500 text-sm">SUPER ADMIN</p>
                    <span className="w-8 h-px bg-gray-700"/>
                </div>

                <h1 className="text-2xl sm:text-3xl font-medium text-gray-900">
                    Monthly Reports
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                    Encrypted PDF sales reports. Only the last 3 months are kept on file.
                </p>

            </div>

            {error && (

                <div className="border border-gray-300 px-5 py-4 mb-4">
                    <p className="text-sm text-gray-700">{error}</p>
                </div>

            )}

            <div className="border border-gray-200">

                {loading ? (

                    <p className="text-sm text-gray-400 px-5 py-8 text-center">
                        Loading...
                    </p>

                ) : (

                    <>

                        {visibleArchives.map((archive, index) => {

                            const isLatest = index === 0
                            const needsDownload = archive.pdf_status === 'created' && !archive.downloaded_at

                            return (
                                <div
                                    key={archive.id}
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-4
                                        px-5
                                        py-4
                                        border-b
                                        border-gray-100
                                        last:border-b-0
                                        hover:bg-gray-50
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="
                                            w-10
                                            h-10
                                            flex-shrink-0
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            flex
                                            items-center
                                            justify-center
                                        ">
                                            <FileText size={16} strokeWidth={1.5} className="text-gray-500" />
                                        </div>

                                        <div>

                                            <p className="text-sm text-gray-900">
                                                {formatPeriod(archive.period_start)}
                                                {isLatest && (
                                                    <span className="ml-2 text-[10px] uppercase tracking-wide border border-gray-300 text-gray-500 px-1.5 py-0.5">
                                                        Latest
                                                    </span>
                                                )}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {archive.total_sales} sales
                                                {' · '}
                                                Nu. {Number(archive.total_amount).toLocaleString()}
                                                {needsDownload && (
                                                    <span className="text-red-600 font-medium">{' · '}Not downloaded</span>
                                                )}
                                                {archive.deletion_status === 'deleted' && (
                                                    <span className="text-gray-400">{' · '}Live data removed</span>
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleDownload(archive)}
                                        disabled={downloadingId === archive.id}
                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            border
                                            px-4
                                            py-2
                                            text-xs
                                            transition
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            flex-shrink-0
                                            ${needsDownload
                                                ? 'bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700'
                                                : 'border-gray-300 text-gray-600 hover:border-black hover:text-black'}
                                        `}
                                    >
                                        <Download size={13} strokeWidth={1.5} />
                                        {downloadingId === archive.id ? 'Downloading...' : 'Download'}
                                    </button>

                                </div>
                            )
                        })}

                        {visibleArchives.length === 0 && (

                            <p className="text-sm text-gray-400 px-5 py-12 text-center">
                                No reports generated yet. The first one is created automatically on the 1st of each month.
                            </p>

                        )}

                    </>

                )}

            </div>

        </div>
    )
}

export default Reports