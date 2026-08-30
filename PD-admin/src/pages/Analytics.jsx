import React, { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'

const Analytics = () => {

    const [expandedId, setExpandedId] = useState(null)

    // TEMP mock sales — replace with GET /api/sales (+ items) later
    const [sales] = useState([
        {
            id: 'sale-1001',
            createdAt: '2026-08-29T09:15:00',
            total: 47500,
            items: [
                { name: 'King Koil Natural', price: 45000, quantity: 1 },
                { name: 'Premium Cotton Bedsheet', price: 2500, quantity: 1 }
            ]
        },
        {
            id: 'sale-1002',
            createdAt: '2026-08-29T11:40:00',
            total: 65000,
            items: [
                { name: 'Modern 3 Seater Sofa', price: 65000, quantity: 1 }
            ]
        },
        {
            id: 'sale-1003',
            createdAt: '2026-08-28T14:05:00',
            total: 28000,
            items: [
                { name: 'Premium Comfort Mattress', price: 28000, quantity: 1 }
            ]
        },
        {
            id: 'sale-1004',
            createdAt: '2026-08-28T16:20:00',
            total: 5000,
            items: [
                { name: 'Premium Cotton Bedsheet', price: 2500, quantity: 2 }
            ]
        }
    ])

    const now = new Date()

    // today
    const todayKey = now.toISOString().slice(0, 10)

    const todaySales = sales.filter((sale) =>
        sale.createdAt.slice(0, 10) === todayKey
    )

    const todayRevenue = todaySales.reduce(
        (sum, sale) => sum + sale.total,
        0
    )

    // rolling 7-day window, including today
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 6)
    weekAgo.setHours(0, 0, 0, 0)

    const weekSales = sales.filter((sale) =>
        new Date(sale.createdAt) >= weekAgo
    )

    const weekRevenue = weekSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    )

    // current calendar month (e.g. "2026-08")
    const monthKey = now.toISOString().slice(0, 7)

    const monthSales = sales.filter((sale) =>
        sale.createdAt.slice(0, 7) === monthKey
    )

    const monthRevenue = monthSales.reduce(
        (sum, sale) => sum + sale.total,
        0
    )

    const periodCards = [
        {
            label: 'Today',
            revenue: todayRevenue,
            count: todaySales.length
        },
        {
            label: 'This Week',
            revenue: weekRevenue,
            count: weekSales.length
        },
        {
            label: 'This Month',
            revenue: monthRevenue,
            count: monthSales.length
        }
    ]

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

            <div className="mb-8">

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
                                                    {sale.id}
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

        </div>
    )
}

export default Analytics