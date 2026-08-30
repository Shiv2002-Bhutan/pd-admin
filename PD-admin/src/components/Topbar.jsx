import React from 'react'
import {
    Menu,
    Bell
} from 'lucide-react'

const Topbar = ({ setIsOpen, title = 'Items' }) => {

    return (
        <header className='
            h-20
            bg-white
            border-b
            border-gray-200
            flex
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-10
        '>

            {/* Left */}
            <div className='flex items-center gap-4'>

                {/* Mobile Menu */}
                <button
                    onClick={() => setIsOpen(true)}
                    className='
                        lg:hidden
                        text-gray-500
                        hover:text-black
                        transition
                    '
                >
                    <Menu
                        size={21}
                        strokeWidth={1.5}
                    />
                </button>


                {/* Page Title */}
                <div>

                    {/* Desktop */}
                    <div className='
                        hidden
                        sm:flex
                        items-center
                        gap-2
                    '>

                        <p className='
                            text-sm
                            text-gray-500
                        '>
                            PD Furniture
                        </p>

                        <span className='
                            w-6
                            h-[1px]
                            bg-gray-400
                        ' />

                        <p className='
                            text-sm
                            text-gray-800
                            font-medium
                        '>
                            {title}
                        </p>

                    </div>


                    {/* Mobile */}
                    <p className='
                        sm:hidden
                        text-sm
                        text-gray-800
                        font-medium
                    '>
                        {title}
                    </p>

                </div>

            </div>


            {/* Right */}
            <div className='
                flex
                items-center
                gap-5
                sm:gap-7
            '>

                {/* Notifications */}
                <button
                    className='
                        relative
                        text-gray-500
                        hover:text-black
                        transition
                    '
                >

                    <Bell
                        size={19}
                        strokeWidth={1.5}
                    />

                    {/* Notification Dot */}
                    <span className='
                        absolute
                        -top-1
                        -right-1
                        w-2
                        h-2
                        bg-black
                        rounded-full
                    ' />

                </button>


                {/* Divider */}
                <span className='
                    h-5
                    w-[1px]
                    bg-gray-200
                ' />


                {/* Admin */}
                <div className='hidden sm:block'>

                    <p className='
                        text-xs
                        text-gray-800
                    '>
                        Admin
                    </p>

                    <p className='
                        text-[10px]
                        text-gray-500
                        mt-0.5
                    '>
                        PD Furniture
                    </p>

                </div>

            </div>

        </header>
    )
}

export default Topbar