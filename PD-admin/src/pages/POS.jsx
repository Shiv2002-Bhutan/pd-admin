import React, { useState } from 'react'

import ProductList from '../components/pos/ProductList'
import Receipt from '../components/pos/Receipt'

const POS = () => {

    const [search, setSearch] = useState('')

    const [cart, setCart] = useState([])

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // TEMP mock products — replace with shared product source later
    const [products] = useState([
        {
            id: 'item-001',
            name: 'King Koil Natural',
            price: 45000,
            stock: 8
        },
        {
            id: 'item-002',
            name: 'Modern 3 Seater Sofa',
            price: 65000,
            stock: 5
        },
        {
            id: 'item-003',
            name: 'Premium Cotton Bedsheet',
            price: 2500,
            stock: 15
        },
        {
            id: 'item-004',
            name: 'Premium Comfort Mattress',
            price: 28000,
            stock: 3
        }
    ])

    const filteredProducts = products.filter((product) => {

        const text = search.toLowerCase().trim()

        return product.name.toLowerCase().includes(text)
    })

    const handleAddToCart = (product) => {

        setError('')
        setSuccess('')

        setCart((previous) => {

            const existing = previous.find(
                (line) => line.id === product.id
            )

            if (existing) {

                return previous.map((line) => {

                    if (line.id === product.id) {
                        return {
                            ...line,
                            qty: line.qty + 1
                        }
                    }

                    return line
                })
            }

            return [
                ...previous,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1
                }
            ]
        })
    }

    const handleUpdateQty = (id, qty) => {

        if (qty < 1) return

        setCart((previous) =>
            previous.map((line) => {

                if (line.id === id) {
                    return {
                        ...line,
                        qty
                    }
                }

                return line
            })
        )
    }

    const handleUpdatePrice = (id, price) => {

        if (price < 0) return

        setCart((previous) =>
            previous.map((line) => {

                if (line.id === id) {
                    return {
                        ...line,
                        price
                    }
                }

                return line
            })
        )
    }

    const handleRemove = (id) => {

        setCart((previous) =>
            previous.filter((line) => line.id !== id)
        )
    }

    const total = cart.reduce(
        (sum, line) => sum + (line.price * line.qty),
        0
    )

    const handleCompleteSale = () => {

        setError('')
        setSuccess('')

        if (cart.length === 0) {
            setError('Add at least one item.')
            return
        }

        const sale = {
            id: `sale-${Date.now()}`,
            items: cart,
            total,
            createdAt: new Date().toISOString()
        }

        // TEMP — replace with API call / shared sales store
        console.log('Sale recorded:', sale)

        setCart([])
        setSuccess('Sale recorded successfully.')
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
                        SALES
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
                    Point of Sale
                </h1>

                <p className="
                    text-sm
                    text-gray-500
                    mt-2
                ">
                    Record a new sale.
                </p>

            </div>


            {/* LAYOUT */}

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-[1fr_360px]
                gap-6
                items-start
            ">

                <ProductList
                    products={filteredProducts}
                    search={search}
                    setSearch={setSearch}
                    onAddToCart={handleAddToCart}
                />

                <Receipt
                    cart={cart}
                    onUpdateQty={handleUpdateQty}
                    onUpdatePrice={handleUpdatePrice}
                    onRemove={handleRemove}
                    total={total}
                    error={error}
                    success={success}
                    onCompleteSale={handleCompleteSale}
                />

            </div>

        </div>
    )
}

export default POS