import React, { useState, useEffect } from 'react'

import ProductList from '../components/pos/ProductList'
import Receipt from '../components/pos/Receipt'
import Toast from '../components/Toast'

import { getItems, createSale } from '../services/api'

const POS = () => {

    const [search, setSearch] = useState('')

    const [cart, setCart] = useState([])

    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const [toast, setToast] = useState(null)

    const fetchProducts = async () => {

        setLoadingProducts(true)
        setLoadError('')

        try {

            const data = await getItems()

            const normalized = data.map((item) => ({
                id: item.id,
                name: item.name,
                price: Number(item.price),
                stock: item.stock
            }))

            setProducts(normalized)

        } catch (err) {

            console.error(err)
            setLoadError('Could not load products. Try again.')

        } finally {

            setLoadingProducts(false)
        }
    }

    useEffect(() => {

        fetchProducts()

    }, [])

    const filteredProducts = products.filter((product) => {

        const text = search.toLowerCase().trim()

        return product.name.toLowerCase().includes(text)
    })

    const handleAddToCart = (product) => {

        setError('')

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

    const handleCompleteSale = async () => {

        setError('')

        if (cart.length === 0) {
            setError('Add at least one item.')
            return
        }

        setSubmitting(true)

        try {

            const saleItems = cart.map((line) => ({
                id: line.id,
                name: line.name,
                price: line.price,
                quantity: line.qty
            }))

            await createSale(saleItems)

            setCart([])

            setToast({
                type: 'success',
                message: 'Sale recorded successfully.'
            })

            fetchProducts()

        } catch (err) {

            console.error(err)

            setToast({
                type: 'error',
                message: err.message || 'Failed to record sale.'
            })

        } finally {

            setSubmitting(false)
        }
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


            {/* LOAD ERROR */}

            {loadError && (

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
                        {loadError}
                    </p>

                </div>

            )}


            {/* LAYOUT */}

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-[1fr_360px]
                gap-6
                items-start
            ">

                {loadingProducts ? (

                    <p className="
                        text-sm
                        text-gray-400
                        py-10
                    ">
                        Loading products...
                    </p>

                ) : (

                    <ProductList
                        products={filteredProducts}
                        search={search}
                        setSearch={setSearch}
                        onAddToCart={handleAddToCart}
                    />

                )}

                <Receipt
                    cart={cart}
                    onUpdateQty={handleUpdateQty}
                    onUpdatePrice={handleUpdatePrice}
                    onRemove={handleRemove}
                    total={total}
                    error={error}
                    submitting={submitting}
                    onCompleteSale={handleCompleteSale}
                />

            </div>


            {/* TOAST */}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

        </div>
    )
}

export default POS