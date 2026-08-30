import React from 'react'
import { Search, Package, Plus } from 'lucide-react'

const ProductList = ({
    products,
    search,
    setSearch,
    onAddToCart
}) => {

    return (
        <div>

            {/* SEARCH */}

            <div className="
                relative
                w-full
                sm:max-w-md
                mb-6
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


            {/* LIST */}

            <div className="
                border
                border-gray-200
            ">

                {products.map((product) => {

                    const outOfStock = product.stock <= 0

                    return (
                        <div
                            key={product.id}
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
                                    w-11
                                    h-11
                                    flex-shrink-0
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    flex
                                    items-center
                                    justify-center
                                ">

                                    <Package
                                        size={18}
                                        strokeWidth={1}
                                        className="text-gray-400"
                                    />

                                </div>

                                <div className="min-w-0">

                                    <p className="
                                        text-sm
                                        text-gray-900
                                        truncate
                                    ">
                                        {product.name}
                                    </p>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                    ">
                                        Nu. {product.price.toLocaleString()}
                                        {' · '}
                                        {outOfStock
                                            ? 'Out of stock'
                                            : `${product.stock} in stock`}
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                disabled={outOfStock}
                                onClick={() =>
                                    onAddToCart(product)
                                }
                                className={
                                    outOfStock
                                        ? 'flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 text-gray-300 cursor-not-allowed'
                                        : 'flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-300 text-gray-600 hover:border-black hover:text-black transition'
                                }
                            >

                                <Plus
                                    size={13}
                                    strokeWidth={1.5}
                                />

                                Add

                            </button>

                        </div>
                    )
                })}

                {products.length === 0 && (

                    <div className="
                        py-16
                        text-center
                    ">

                        <Package
                            size={26}
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
                            No products found.
                        </p>

                    </div>

                )}

            </div>

        </div>
    )
}

export default ProductList