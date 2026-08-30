import React, { useState, useEffect } from 'react'
import { AlertTriangle, Package, RefreshCw } from 'lucide-react'

const Notification = () => {

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchLowStockItems = async () => {

        setLoading(true)
        setError('')

        try {

            const response = await fetch(
                'http://localhost:5000/api/items/low-stock'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch alerts.')
            }

            const data = await response.json()

            setItems(data)

        } catch (err) {

            console.error(err)
            setError('Could not load notifications. Try again.')

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        fetchLowStockItems()

    }, [])

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
                            ALERTS
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
                        Notifications
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">
                        Items that have reached their low stock threshold.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={fetchLowStockItems}
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


            {/* COUNT */}

            <div className="
                flex
                justify-between
                items-center
                mb-4
            ">

                <p className="
                    text-sm
                    text-gray-500
                ">
                    {loading
                        ? 'Loading...'
                        : `${items.length} ${items.length === 1 ? 'Alert' : 'Alerts'}`
                    }
                </p>

            </div>


            {/* ERROR */}

            {error && (

                <div className="
                    border
                    border-gray-300
                    px-5
                    py-4
                    mb-4
                ">

                    <p className="
                        text-sm
                        text-gray-700
                    ">
                        {error}
                    </p>

                </div>

            )}


            {/* LIST */}

            {!error && (

                <div className="
                    border
                    border-gray-200
                ">

                    {loading ? (

                        <div className="
                            py-20
                            text-center
                        ">

                            <p className="
                                text-sm
                                text-gray-400
                            ">
                                Loading notifications...
                            </p>

                        </div>

                    ) : (

                        <>

                            {items.map((item) => {

                                const outOfStock = item.stock === 0

                                return (
                                    <div
                                        key={item.id}
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

                                        <div className="
                                            flex
                                            items-center
                                            gap-4
                                            min-w-0
                                        ">

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

                                                <AlertTriangle
                                                    size={16}
                                                    strokeWidth={1.5}
                                                    className="text-gray-500"
                                                />

                                            </div>

                                            <div className="min-w-0">

                                                <p className="
                                                    text-sm
                                                    text-gray-900
                                                    truncate
                                                ">
                                                    {item.name}
                                                </p>

                                                <p className="
                                                    text-xs
                                                    text-gray-500
                                                    mt-1
                                                ">
                                                    {item.category}
                                                    {item.brand ? ` · ${item.brand}` : ''}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="
                                            text-right
                                            flex-shrink-0
                                        ">

                                            <p className={
                                                outOfStock
                                                    ? 'text-sm text-black font-medium'
                                                    : 'text-sm text-gray-800'
                                            }>
                                                {outOfStock
                                                    ? 'Out of stock'
                                                    : `${item.stock} left`}
                                            </p>

                                            <p className="
                                                text-[10px]
                                                text-gray-400
                                                mt-1
                                            ">
                                                Threshold: {item.low_stock_threshold}
                                            </p>

                                        </div>

                                    </div>
                                )
                            })}

                            {items.length === 0 && (

                                <div className="
                                    py-20
                                    text-center
                                ">

                                    <Package
                                        size={28}
                                        strokeWidth={1}
                                        className="
                                            mx-auto
                                            text-gray-400
                                        "
                                    />

                                    <p className="
                                        text-sm
                                        text-gray-500
                                        mt-3
                                    ">
                                        No low stock alerts.
                                    </p>

                                </div>

                            )}

                        </>

                    )}

                </div>

            )}

        </div>
    )
}

export default Notification