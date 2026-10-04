import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, RefreshCw } from 'lucide-react'

import { getAnalyticsSummary, getAnalyticsSales } from '../services/api'

const Analytics = () => {

    const [expandedId, setExpandedId] = useState(null)

    const [summary, setSummary] = useState(null)
    const [sales, setSales] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchData = async () => {

        setLoading(true)
        setError('')

        try {

            const [summaryData, salesData] = await Promise.all([
                getAnalyticsSummary(),
                getAnalyticsSales()
            ])

            setSummary(summaryData)
            setSales(salesData)

        } catch (err) {

            console.error(err)
            setError('Could not load analytics. Try again.')

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        fetchData()

    }, [])

    const periodCards = summary
        ? [
            {
                label: 'Today',
                revenue: summary.today.revenue,
                count: summary.today.count
            },
            {
                label: 'This Week',
                revenue: summary.week.revenue,
                count: summary.week.count
            },
            {
                label: 'This Month',
                revenue: summary.month.revenue,
                count: summary.month.count
            }
        ]
        : []

    // group all sales by date, most recent first
    const salesByDate = sales.reduce((groups, sale) => {

        const dateKey = sale.createdAt.slice(0, 10)

        if (!groups[dateKey]) {
            groups[dateKey] = []
        }

        groups[dateKey].push(sale)

        return groups
    }, {})

    const sortedDates = Object.keys(salesByDate).sort(
        (a, b) => new Date(b) - new Date(a)
    )

    const formatDate = (dateKey) =>
        new Date(dateKey).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })

    const formatTime = (isoString) =>
        new Date(isoString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        })

    const toggleExpand = (id) => {

        setExpandedId((previous) =>
            previous === id ? null : id
        )
    }

    return (
        <div className="w-full">

            {/* HEADER */}

            <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-end
                sm:justify-between
                gap-5
                mb-8
            ">

                <div>

                    <div className="
                        inline-flex
                        items-center
                        gap-2
                        mb-2
                    ">

                        <p className="
                            text-gray-500
                            text-sm
                        ">
                            SUPER ADMIN
                        </p>

                        <span className="
                            w-8
                            h-px
                            bg-gray-700
                        "/>

                    </div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-medium
                        text-gray-900
                    ">
                        Sales Analytics
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">
                        Daily, weekly, and monthly performance, plus individual sale records.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={fetchData}
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        border
                        border-gray-300
                        text-gray-600
                        px-5
                        py-2.5
                        text-sm
                        hover:border-black
                        hover:text-black
                        transition
                        w-full
                        sm:w-auto
                        disabled:opacity-50
                    "
                >

                    <RefreshCw
                        size={15}
                        strokeWidth={1.5}
                        className={loading ? 'animate-spin' : ''}
                    />

                    Refresh

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="
                    border
                    border-gray-300
                    px-5
                    py-4
                    mb-6
                ">

                    <p className="
                        text-sm
                        text-gray-700
                    ">
                        {error}
                    </p>

                </div>

            )}


            {loading ? (

                <p className="
                    text-sm
                    text-gray-400
                    py-10
                ">
                    Loading analytics...
                </p>

            ) : (

                <>

                    {/* SUMMARY */}

                    <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-3
                        gap-4
                        mb-8
                    ">

                        {periodCards.map((period) => (

                            <div
                                key={period.label}
                                className="
                                    border
                                    border-gray-200
                                    p-5
                                "
                            >

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mb-3
                                ">
                                    {period.label}
                                </p>

                                <p className="
                                    text-2xl
                                    text-gray-900
                                ">
                                    Nu. {period.revenue.toLocaleString()}
                                </p>

                                <p className="
                                    text-xs
                                    text-gray-500
                                    mt-2
                                ">
                                    {period.count}{' '}
                                    {period.count === 1 ? 'sale' : 'sales'}
                                </p>

                            </div>

                        ))}

                    </div>


                    {/* SALES BY DATE */}

                    <div className="
                        flex
                        items-center
                        gap-2
                        mb-4
                    ">

                        <TrendingUp
                            size={16}
                            strokeWidth={1.5}
                            className="text-gray-500"
                        />

                        <p className="
                            text-sm
                            text-gray-900
                        ">
                            All Sales
                        </p>

                    </div>

                    {sortedDates.map((dateKey) => {

                        const dateSales = salesByDate[dateKey]

                        const dateTotal = dateSales.reduce(
                            (sum, sale) => sum + sale.total,
                            0
                        )

                        return (
                            <div
                                key={dateKey}
                                className="mb-6"
                            >

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    mb-2
                                ">

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        {formatDate(dateKey)}
                                    </p>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        {dateSales.length}{' '}
                                        {dateSales.length === 1 ? 'sale' : 'sales'}
                                        {' · '}
                                        Nu. {dateTotal.toLocaleString()}
                                    </p>

                                </div>

                                <div className="
                                    border
                                    border-gray-200
                                ">

                                    {dateSales.map((sale) => {

                                        const expanded = expandedId === sale.id

                                        return (
                                            <div
                                                key={sale.id}
                                                className="
                                                    border-b
                                                    border-gray-100
                                                    last:border-b-0
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleExpand(sale.id)
                                                    }
                                                    className="
                                                        w-full
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-4
                                                        px-5
                                                        py-4
                                                        hover:bg-gray-50
                                                        text-left
                                                    "
                                                >

                                                    <div>

                                                        <p className="
                                                            text-sm
                                                            text-gray-900
                                                        ">
                                                            Sale #{sale.id}
                                                        </p>

                                                        <p className="
                                                            text-xs
                                                            text-gray-500
                                                            mt-1
                                                        ">
                                                            {formatTime(sale.createdAt)}
                                                            {' · '}
                                                            {sale.items.length}{' '}
                                                            {sale.items.length === 1
                                                                ? 'item'
                                                                : 'items'}
                                                            {' · '}
                                                            By {sale.performedBy}
                                                        </p>

                                                    </div>

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-4
                                                    ">

                                                        <p className="
                                                            text-sm
                                                            text-gray-900
                                                        ">
                                                            Nu. {sale.total.toLocaleString()}
                                                        </p>

                                                        {expanded ? (
                                                            <ChevronUp
                                                                size={16}
                                                                strokeWidth={1.5}
                                                                className="text-gray-400"
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={16}
                                                                strokeWidth={1.5}
                                                                className="text-gray-400"
                                                            />
                                                        )}

                                                    </div>

                                                </button>

                                                {expanded && (

                                                    <div className="
                                                        px-5
                                                        pb-4
                                                        bg-gray-50
                                                    ">

                                                        {sale.items.map((item, index) => (

                                                            <div
                                                                key={index}
                                                                className="
                                                                    flex
                                                                    justify-between
                                                                    text-xs
                                                                    text-gray-600
                                                                    py-1.5
                                                                "
                                                            >

                                                                <span>
                                                                    {item.name} × {item.quantity}
                                                                </span>

                                                                <span>
                                                                    Nu.{' '}
                                                                    {(item.price * item.quantity).toLocaleString()}
                                                                </span>

                                                            </div>

                                                        ))}

                                                    </div>

                                                )}

                                            </div>
                                        )
                                    })}

                                </div>

                            </div>
                        )
                    })}

                    {sales.length === 0 && (

                        <div className="
                            py-20
                            text-center
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                            ">
                                No sales recorded yet.
                            </p>

                        </div>

                    )}

                </>

            )}

        </div>
    )
}

export default Analytics