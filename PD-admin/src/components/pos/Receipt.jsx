import React from 'react'
import { X, Receipt as ReceiptIcon } from 'lucide-react'

const Receipt = ({
    cart,
    onUpdateQty,
    onUpdatePrice,
    onRemove,
    total,
    error,
    success,
    onCompleteSale
}) => {

    return (
        <div className="
            border
            border-gray-200
            sticky
            top-6
        ">

            {/* HEADER */}

            <div className="
                flex
                items-center
                gap-2
                px-5
                py-4
                border-b
                border-gray-200
            ">

                <ReceiptIcon
                    size={16}
                    strokeWidth={1.5}
                    className="text-gray-500"
                />

                <p className="
                    text-sm
                    text-gray-900
                ">
                    Current Sale
                </p>

            </div>


            {/* LINE ITEMS */}

            <div className="
                max-h-96
                overflow-y-auto
            ">

                {cart.length === 0 ? (

                    <p className="
                        text-sm
                        text-gray-400
                        px-5
                        py-8
                        text-center
                    ">
                        No items added yet.
                    </p>

                ) : (

                    cart.map((line) => (

                        <div
                            key={line.id}
                            className="
                                px-5
                                py-4
                                border-b
                                border-gray-100
                                last:border-b-0
                            "
                        >

                            <div className="
                                flex
                                items-start
                                justify-between
                                gap-3
                                mb-3
                            ">

                                <p className="
                                    text-sm
                                    text-gray-900
                                    truncate
                                ">
                                    {line.name}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => onRemove(line.id)}
                                    className="
                                        text-gray-400
                                        hover:text-black
                                        flex-shrink-0
                                    "
                                >
                                    <X size={14} strokeWidth={1.5} />
                                </button>

                            </div>

                            <div className="
                                grid
                                grid-cols-2
                                gap-3
                                mb-3
                            ">

                                <div>

                                    <label className="
                                        block
                                        text-[10px]
                                        text-gray-400
                                        mb-1
                                    ">
                                        Selling Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={line.price}
                                        onChange={(event) =>
                                            onUpdatePrice(
                                                line.id,
                                                Number(event.target.value)
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            px-2.5
                                            py-1.5
                                            text-sm
                                            outline-none
                                            focus:border-black
                                        "
                                    />

                                </div>

                                <div>

                                    <label className="
                                        block
                                        text-[10px]
                                        text-gray-400
                                        mb-1
                                    ">
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={line.qty}
                                        onChange={(event) =>
                                            onUpdateQty(
                                                line.id,
                                                Number(event.target.value)
                                            )
                                        }
                                        className="
                                            w-full
                                            border
                                            border-gray-300
                                            px-2.5
                                            py-1.5
                                            text-sm
                                            outline-none
                                            focus:border-black
                                        "
                                    />

                                </div>

                            </div>

                            <p className="
                                text-xs
                                text-gray-500
                                text-right
                            ">
                                Subtotal: Nu.{' '}
                                {(line.price * line.qty).toLocaleString()}
                            </p>

                        </div>
                    ))

                )}

            </div>


            {/* TOTAL */}

            <div className="
                flex
                justify-between
                items-center
                px-5
                py-4
                border-t
                border-gray-200
            ">

                <span className="
                    text-sm
                    text-gray-600
                ">
                    Total
                </span>

                <span className="
                    text-lg
                    text-gray-900
                ">
                    Nu. {total.toLocaleString()}
                </span>

            </div>


            {/* FEEDBACK */}

            {(error || success) && (

                <div className="px-5 pt-3">

                    <p className={
                        error
                            ? 'text-xs text-black'
                            : 'text-xs text-gray-500'
                    }>
                        {error || success}
                    </p>

                </div>

            )}


            {/* ACTION */}

            <div className="px-5 py-4">

                <button
                    type="button"
                    onClick={onCompleteSale}
                    className="
                        w-full
                        bg-black
                        text-white
                        py-3
                        text-sm
                        hover:bg-gray-800
                        transition
                    "
                >
                    Complete Sale
                </button>

            </div>

        </div>
    )
}

export default Receipt