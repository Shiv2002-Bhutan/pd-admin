import React, { useState } from 'react'
import {
    Search,
    Plus,
    Pencil,
    Package
} from 'lucide-react'

import AddItem from './AddItem'
import EditItem from '../components/EditItem'
import AddStock from '../components/AddStock'

const Items = () => {

    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')

    const [showAddItem, setShowAddItem] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [stockItem, setStockItem] = useState(null)

    const [items, setItems] = useState([
        {
            id: 'item-001',
            name: 'King Koil Natural',
            category: 'King Koil',
            subCategory: 'Mattress',
            brand: 'King Koil',
            price: 45000,
            stock: 8,
            lowStockThreshold: 3,
            image: ''
        },
        {
            id: 'item-002',
            name: 'Modern 3 Seater Sofa',
            category: 'Furniture',
            subCategory: 'Sofa',
            brand: 'PD Furniture',
            price: 65000,
            stock: 5,
            lowStockThreshold: 2,
            image: ''
        },
        {
            id: 'item-003',
            name: 'Premium Cotton Bedsheet',
            category: 'Clothing',
            subCategory: 'Bedsheet',
            brand: 'PD Furniture',
            price: 2500,
            stock: 15,
            lowStockThreshold: 5,
            image: ''
        },
        {
            id: 'item-004',
            name: 'Premium Comfort Mattress',
            category: 'Mattresses',
            subCategory: 'Mattress',
            brand: 'PD Furniture',
            price: 28000,
            stock: 3,
            lowStockThreshold: 3,
            image: ''
        }
    ])

    const categories = [
        'All',
        'King Koil',
        'Furniture',
        'Clothing',
        'Mattresses'
    ]

    const filteredItems = items.filter((item) => {

        const text = search.toLowerCase().trim()

        const matchesSearch =
            item.name.toLowerCase().includes(text) ||
            item.category.toLowerCase().includes(text) ||
            item.subCategory.toLowerCase().includes(text) ||
            item.brand.toLowerCase().includes(text)

        const matchesCategory =
            activeCategory === 'All' ||
            item.category === activeCategory

        return matchesSearch && matchesCategory
    })

    const handleAddItem = (newItem) => {

        const item = {
            ...newItem,
            id: `item-${Date.now()}`
        }

        setItems((previous) => [
            ...previous,
            item
        ])

        setShowAddItem(false)
    }

    const handleUpdateItem = (updatedItem) => {

        setItems((previous) =>
            previous.map((item) => {

                if (item.id === updatedItem.id) {
                    return updatedItem
                }

                return item
            })
        )

        setEditingItem(null)
    }

    const handleAddStock = (updatedItem) => {

        setItems((previous) =>
            previous.map((item) => {

                if (item.id === updatedItem.id) {
                    return updatedItem
                }

                return item
            })
        )

        setStockItem(null)
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
                        "/>

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
                    {filteredItems.length}{' '}
                    {filteredItems.length === 1
                        ? 'Item'
                        : 'Items'}
                </p>

            </div>


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
                        item.stock <= item.lowStockThreshold

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

                                    {item.image ? (

                                        <img
                                            src={item.image}
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
                                Nu. {item.price.toLocaleString()}
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
                        item.stock <= item.lowStockThreshold

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

                                    {item.image ? (

                                        <img
                                            src={item.image}
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
                                        justify-between
                                        gap-3
                                    ">

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
                                                {item.category}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingItem(item)
                                            }
                                            className="
                                                text-gray-500
                                                hover:text-black
                                            "
                                        >

                                            <Pencil
                                                size={16}
                                                strokeWidth={1.5}
                                            />

                                        </button>

                                    </div>


                                    <div className="
                                        flex
                                        justify-between
                                        items-center
                                        mt-4
                                    ">

                                        <p className="text-sm">
                                            Nu.{' '}
                                            {item.price.toLocaleString()}
                                        </p>

                                        <p className={
                                            isLowStock
                                                ? 'text-xs text-black font-medium'
                                                : 'text-xs text-gray-500'
                                        }>
                                            Stock: {item.stock}
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStockItem(item)
                                        }
                                        className="
                                            mt-3
                                            text-xs
                                            text-gray-500
                                            underline
                                            underline-offset-4
                                            hover:text-black
                                        "
                                    >
                                        Add Stock
                                    </button>

                                </div>

                            </div>

                        </div>
                    )
                })}

            </div>


            {/* EMPTY */}

            {filteredItems.length === 0 && (

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
                        No items found.
                    </p>

                    {(search || activeCategory !== 'All') && (

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="
                                mt-4
                                text-xs
                                text-gray-600
                                underline
                            "
                        >
                            Clear filters
                        </button>

                    )}

                </div>

            )}


            {/* ADD ITEM MODAL */}

            {showAddItem && (
                <AddItem
                    onClose={() =>
                        setShowAddItem(false)
                    }
                    onAdd={handleAddItem}
                />
            )}


            {/* EDIT ITEM MODAL */}

            {editingItem && (
                <EditItem
                    item={editingItem}
                    onClose={() =>
                        setEditingItem(null)
                    }
                    onUpdate={handleUpdateItem}
                />
            )}


            {/* ADD STOCK MODAL */}

            {stockItem && (
                <AddStock
                    item={stockItem}
                    onClose={() =>
                        setStockItem(null)
                    }
                    onAdd={handleAddStock}
                />
            )}

        </div>
    )
}

export default Items