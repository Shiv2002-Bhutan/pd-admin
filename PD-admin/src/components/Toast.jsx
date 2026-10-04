import React, { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose }) => {

    useEffect(() => {

        const timer = setTimeout(() => {
            onClose()
        }, 4000)

        return () => clearTimeout(timer)

    }, [onClose])

    const isSuccess = type === 'success'

    return (
        <div className="
            fixed
            bottom-6
            right-6
            z-[200]
            animate-slide-up
        ">

            <div className="
                flex
                items-start
                gap-3
                bg-white
                border
                border-gray-200
                shadow-lg
                px-5
                py-4
                min-w-[280px]
                max-w-sm
            ">

                {isSuccess ? (

                    <CheckCircle2
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-900 flex-shrink-0 mt-0.5"
                    />

                ) : (

                    <XCircle
                        size={18}
                        strokeWidth={1.5}
                        className="text-gray-900 flex-shrink-0 mt-0.5"
                    />

                )}

                <p className="
                    text-sm
                    text-gray-900
                    flex-1
                ">
                    {message}
                </p>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        text-gray-400
                        hover:text-black
                        flex-shrink-0
                    "
                >
                    <X size={15} strokeWidth={1.5} />
                </button>

            </div>

        </div>
    )
}

export default Toast