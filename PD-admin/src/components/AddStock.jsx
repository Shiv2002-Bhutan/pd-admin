import React, { useState } from 'react'
import { X, Package } from 'lucide-react'

import { addStock } from '../services/api'

const AddStock = ({ item, onClose, onAdd }) => {

    const [quantity, setQuantity] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')

        const amount = Number(quantity)

        if (!amount || amount <= 0) {
            setError('Enter a quantity greater than 0.')
            return
        }

        setSubmitting(true)

        try {

            await addStock(item.id, amount)

            onAdd()

        } catch (err) {

            console.error(err)
            setError(err.message || 'Failed to add stock.')

        } finally {

            setSubmitting(false)
        }
    }

    return (
        <div className="
            fixed
            inset-0
            z-[100]
            bg-black/30
            flex
            items-center
            justify-center
            p-4
        ">

            <div className="
                bg-white
                w-full
                max-w-md
                border
                border-gray-200
            ">

                {/* HEADER */}

                <div className="
                    flex
                    items-center
                    justify-between
                    px-5
                    sm:px-7
                    py-5
                    border-b
                    border-gray-200
                ">

                    <div>

                        <div className="
                            inline-flex
                            items-center
                            gap-2
                            mb-1
                        ">

                            <p className="
                                text-xs
                                text-gray-500
                            ">
                                INVENTORY
                            </p>

                            <span className="
                                w-6
                                h-[1px]
                                bg-gray-400
                            "/>

                        </div>

                        <h2 className="
                            text-xl
                            font-medium
                            text-gray-900
                        ">
                            Add Stock
                        </h2>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            text-gray-500
                            hover:text-black
                            transition
                        "
                    >
                        <X
                            size={19}
                            strokeWidth={1.5}
                        />
                    </button>

                </div>


                {/* CONTENT */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        px-5
                        sm:px-7
                        py-6
                    "
                >

                    {/* PRODUCT */}

                    <div className="
                        flex
                        items-center
                        gap-4
                        mb-6
                        pb-5
                        border-b
                        border-gray-100
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
                            flex-shrink-0
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
                                {item.category}
                            </p>

                        </div>

                    </div>


                    {/* CURRENT STOCK */}

                    <div className="mb-5">

                        <p className="
                            text-xs
                            text-gray-500
                            mb-2
                        ">
                            CURRENT STOCK
                        </p>

                        <p className="
                            text-lg
                            text-gray-900
                        ">
                            {item.stock}
                        </p>

                    </div>


                    {/* QUANTITY */}

                    <div className="mb-6">

                        <label className="
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        ">
                            Quantity to Add
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(e.target.value)
                            }
                            placeholder="Enter quantity"
                            className="
                                w-full
                                border
                                border-gray-300
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-black
                            "
                            autoFocus
                        />

                        <p className="
                            text-xs
                            text-gray-400
                            mt-2
                        ">
                            Stock will be increased by this quantity.
                        </p>

                    </div>


                    {error && (

                        <p className="
                            text-xs
                            text-black
                            mb-4
                        ">
                            {error}
                        </p>

                    )}


                    {/* ACTIONS */}

                    <div className="
                        flex
                        flex-col-reverse
                        sm:flex-row
                        justify-end
                        gap-3
                        pt-5
                        border-t
                        border-gray-100
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                border
                                border-gray-300
                                text-gray-600
                                px-5
                                py-2.5
                                text-sm
                                hover:border-black
                                hover:text-black
                                transition
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                bg-black
                                text-white
                                px-5
                                py-2.5
                                text-sm
                                hover:bg-gray-800
                                transition
                                disabled:opacity-50
                            "
                        >
                            {submitting ? 'Adding...' : 'Add Stock'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddStock