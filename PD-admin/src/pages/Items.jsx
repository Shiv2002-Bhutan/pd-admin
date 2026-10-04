import React, { useState, useEffect } from 'react'
import {
    Search,
    Plus,
    Pencil,
    Package
} from 'lucide-react'

import AddItem from './AddItem'
import EditItem from '../components/EditItem'
import AddStock from '../components/AddStock'

import { getItems } from '../services/api'

const Items = () => {

    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const [showAddItem, setShowAddItem] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [stockItem, setStockItem] = useState(null)

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchItems = async () => {

        setLoading(true)
        setError('')

        try {

            const data = await getItems()

            setItems(data)

        } catch (err) {

            console.error(err)
            setError('Could not load items. Try again.')

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {

        fetchItems()

    }, [])

    // CATEGORIES
    const categories = [
        'All',
        'King Koil',
        'Furniture',
        'Clothing',
        'Mattresses',
        'Rubber Wood'
    ]

    // FILTER ITEMS
    const filteredItems = items.filter((item) => {

        const text = search.toLowerCase().trim()

        const matchesSearch =
            item.name.toLowerCase().includes(text) ||
            (item.category || '').toLowerCase().includes(text) ||
            (item.sub_category || '').toLowerCase().includes(text) ||
            (item.brand || '').toLowerCase().includes(text)

        // Normal category filtering
        // Rubber Wood uses sub_category
        const matchesCategory =
            activeCategory === 'All' ||
            item.category === activeCategory ||
            (
                activeCategory === 'Rubber Wood' &&
                (item.sub_category || '').toLowerCase() === 'rubberwood'
            )

        return matchesSearch && matchesCategory

    })

    const handleItemAdded = () => {

        setShowAddItem(false)
        fetchItems()

    }

    const handleItemUpdated = () => {

        setEditingItem(null)
        fetchItems()

    }

    const handleStockAdded = () => {

        setStockItem(null)
        fetchItems()

    }

    const clearFilters = () => {

        setSearch('')
        setActiveCategory('All')

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
                            ITEMS
                        </p>

                        <span className="
                            w-8
                            h-px
                            bg-gray-700
                        " />

                    </div>

                    <h1 className="
                        text-2xl
                        sm:text-3xl
                        font-medium
                        text-gray-900
                    ">
                        Product List
                    </h1>

                    <p className="
                        text-sm
                        text-gray-500
                        mt-2
                    ">
                        Manage products and inventory.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => setShowAddItem(true)}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-black
                        text-white
                        px-5
                        py-2.5
                        text-sm
                        hover:bg-gray-800
                        transition
                        w-full
                        sm:w-auto
                    "
                >

                    <Plus
                        size={17}
                        strokeWidth={1.5}
                    />

                    Add New Item

                </button>

            </div>

            {/* SEARCH */}

            <div className="
                border-b
                border-gray-200
                pb-5
                mb-6
            ">

                <div className="
                    relative
                    w-full
                    sm:max-w-md
                    mb-5
                ">

                    <Search
                        size={17}
                        strokeWidth={1.5}
                        className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search products..."
                        className="
                            w-full
                            border
                            border-gray-300
                            pl-10
                            pr-4
                            py-2.5
                            text-sm
                            outline-none
                            focus:border-black
                        "
                    />

                </div>

                {/* CATEGORY */}

                <div className="
                    flex
                    gap-2
                    overflow-x-auto
                    pb-1
                ">

                    {categories.map((category) => {

                        const active =
                            activeCategory === category

                        return (

                            <button
                                type="button"
                                key={category}
                                onClick={() =>
                                    setActiveCategory(category)
                                }
                                className={
                                    active
                                        ? 'flex-shrink-0 px-4 py-2 text-xs sm:text-sm border bg-black text-white border-black'
                                        : 'flex-shrink-0 px-4 py-2 text-xs sm:text-sm border bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
                                }
                            >
                                {category}
                            </button>

                        )

                    })}

                </div>

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
                        : `${filteredItems.length} ${filteredItems.length === 1 ? 'Item' : 'Items'}`
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

            {!loading && !error && (

                <>

                    {/* DESKTOP */}

                    <div className="
                        hidden
                        md:block
                        border
                        border-gray-200
                    ">

                        <div className="
                            grid
                            grid-cols-[2fr_1.2fr_1fr_1fr_180px]
                            bg-gray-50
                            border-b
                            border-gray-200
                            px-5
                            py-3
                        ">

                            <p className="text-xs text-gray-500">
                                PRODUCT
                            </p>

                            <p className="text-xs text-gray-500">
                                CATEGORY
                            </p>

                            <p className="text-xs text-gray-500">
                                PRICE
                            </p>

                            <p className="text-xs text-gray-500">
                                STOCK
                            </p>

                            <p className="text-xs text-gray-500">
                                ACTION
                            </p>

                        </div>

                        {filteredItems.map((item) => {

                            const isLowStock =
                                item.stock <= item.low_stock_threshold

                            return (

                                <div
                                    key={item.id}
                                    className="
                                        grid
                                        grid-cols-[2fr_1.2fr_1fr_1fr_180px]
                                        items-center
                                        px-5
                                        py-4
                                        border-b
                                        border-gray-100
                                        last:border-b-0
                                        hover:bg-gray-50
                                    "
                                >

                                    {/* PRODUCT */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-4
                                    ">

                                        <div className="
                                            w-14
                                            h-14
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            flex
                                            items-center
                                            justify-center
                                            overflow-hidden
                                        ">

                                            {item.image_url ? (

                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                                                    alt={item.name}
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <Package
                                                    size={20}
                                                    strokeWidth={1}
                                                    className="text-gray-400"
                                                />

                                            )}

                                        </div>

                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-900
                                            ">
                                                {item.name}
                                            </p>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            ">
                                                {item.brand}
                                            </p>

                                        </div>

                                    </div>

                                    {/* CATEGORY */}

                                    <p className="
                                        text-sm
                                        text-gray-600
                                    ">
                                        {item.category}
                                    </p>

                                    {/* PRICE */}

                                    <p className="
                                        text-sm
                                        text-gray-800
                                    ">
                                        Nu. {Number(item.price).toLocaleString()}
                                    </p>

                                    {/* STOCK */}

                                    <div>

                                        <p className={
                                            isLowStock
                                                ? 'text-sm text-black font-medium'
                                                : 'text-sm text-gray-600'
                                        }>
                                            {item.stock}
                                        </p>

                                        {isLowStock && (

                                            <p className="
                                                text-[10px]
                                                text-gray-500
                                                mt-1
                                            ">
                                                Low stock
                                            </p>

                                        )}

                                    </div>

                                    {/* ACTION */}

                                    <div className="
                                        flex
                                        items-center
                                        gap-4
                                    ">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingItem(item)
                                            }
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                text-xs
                                                text-gray-500
                                                hover:text-black
                                            "
                                        >

                                            <Pencil
                                                size={15}
                                                strokeWidth={1.5}
                                            />

                                            Edit

                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStockItem(item)
                                            }
                                            className="
                                                text-xs
                                                text-gray-500
                                                hover:text-black
                                            "
                                        >
                                            Add Stock
                                        </button>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                    {/* MOBILE */}

                    <div className="
                        md:hidden
                        border-t
                        border-gray-200
                    ">

                        {filteredItems.map((item) => {

                            const isLowStock =
                                item.stock <= item.low_stock_threshold

                            return (

                                <div
                                    key={item.id}
                                    className="
                                        py-4
                                        border-b
                                        border-gray-200
                                    "
                                >

                                    <div className="
                                        flex
                                        gap-4
                                    ">

                                        <div className="
                                            w-20
                                            h-20
                                            flex-shrink-0
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            flex
                                            items-center
                                            justify-center
                                            overflow-hidden
                                        ">

                                            {item.image_url ? (

                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                                                    alt={item.name}
                                                    className="
                                                        w-full
                                                        h-full
                                                        object-cover
                                                    "
                                                />

                                            ) : (

                                                <Package
                                                    size={22}
                                                    strokeWidth={1}
                                                    className="text-gray-400"
                                                />

                                            )}

                                        </div>

                                        <div className="
                                            flex-1
                                            min-w-0
                                        ">

                                            <div className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-2
                                            ">

                                                <div>

                                                    <p className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-900
                                                        truncate
                                                    ">
                                                        {item.name}
                                                    </p>

                                                    <p className="
                                                        text-xs
                                                        text-gray-500
                                                        mt-0.5
                                                    ">
                                                        {item.brand}
                                                    </p>

                                                </div>

                                                <p className="
                                                    text-sm
                                                    font-semibold
                                                    text-gray-900
                                                    whitespace-nowrap
                                                ">
                                                    Nu. {Number(item.price).toLocaleString()}
                                                </p>

                                            </div>

                                            <div className="
                                                flex
                                                items-center
                                                gap-2
                                                mt-2
                                                text-xs
                                                text-gray-500
                                            ">

                                                <span>{item.category}</span>
                                                <span>•</span>
                                                <span className={isLowStock ? 'text-black font-medium' : ''}>
                                                    Stock: {item.stock} {isLowStock && '(Low)'}
                                                </span>

                                            </div>

                                            <div className="
                                                flex
                                                items-center
                                                gap-4
                                                mt-3
                                                pt-2
                                                border-t
                                                border-gray-100
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() => setEditingItem(item)}
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1
                                                        text-xs
                                                        text-gray-600
                                                        hover:text-black
                                                    "
                                                >
                                                    <Pencil size={14} strokeWidth={1.5} />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setStockItem(item)}
                                                    className="
                                                        text-xs
                                                        text-gray-600
                                                        hover:text-black
                                                    "
                                                >
                                                    Add Stock
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )

                        })}

                    </div>

                    {/* EMPTY STATE */}

                    {filteredItems.length === 0 && (

                        <div className="
                            text-center
                            py-12
                            border
                            border-gray-200
                            mt-4
                        ">

                            <p className="
                                text-sm
                                text-gray-500
                                mb-3
                            ">
                                No products found matching your filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="
                                    text-xs
                                    underline
                                    text-black
                                    hover:text-gray-600
                                "
                            >
                                Clear filters
                            </button>

                        </div>

                    )}

                </>

            )}

            {/* MODALS */}

            {showAddItem && (
                <AddItem
                    onClose={() => setShowAddItem(false)}
                    onItemAdded={handleItemAdded}
                />
            )}

            {editingItem && (
                <EditItem
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onItemUpdated={handleItemUpdated}
                />
            )}

            {stockItem && (
                <AddStock
                    item={stockItem}
                    onClose={() => setStockItem(null)}
                    onStockAdded={handleStockAdded}
                />
            )}

        </div>

    )

}

export default Items