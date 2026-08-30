import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    Package,
    ShoppingCart,
    Bell,
    BarChart3,
    LogOut,
    X
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const Sidebar = ({ isOpen, setIsOpen }) => {

    const { user, logout } = useAuth()

    const menuItems = [
        {
            name: 'Items',
            path: '/',
            icon: Package
        },
        {
            name: 'POS',
            path: '/pos',
            icon: ShoppingCart
        },
        {
            name: 'Notifications',
            path: '/notification',
            icon: Bell
        }
    ]

    // Analytics only added to the menu for super admins
    if (user?.role === 'super_admin') {

        menuItems.push({
            name: 'Analytics',
            path: '/analytics',
            icon: BarChart3
        })
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className='
                        fixed
                        inset-0
                        bg-black/20
                        z-40
                        lg:hidden
                    '
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed
                    top-0
                    left-0
                    z-50
                    h-screen
                    w-64
                    bg-white
                    border-r
                    border-gray-200
                    flex
                    flex-col
                    transition-transform
                    duration-300
                    lg:translate-x-0
                    ${
                        isOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }
                `}
            >

                {/* Brand */}
                <div className='
                    h-20
                    px-6
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-100
                '>

                    <div>

                        <p className='
                            text-xl
                            font-semibold
                            tracking-tight
                            text-black
                        '>
                            PD Furniture
                        </p>

                        <div className='
                            flex
                            items-center
                            gap-2
                            mt-1
                        '>

                            <p className='
                                text-[10px]
                                text-gray-500
                                tracking-[0.15em]
                            '>
                                ADMIN
                            </p>

                            <span className='
                                w-6
                                h-[1px]
                                bg-gray-400
                            ' />

                        </div>

                    </div>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className='
                            lg:hidden
                            text-gray-500
                            hover:text-black
                            transition
                        '
                    >
                        <X
                            size={19}
                            strokeWidth={1.5}
                        />
                    </button>

                </div>


                {/* Navigation */}
                <nav className='flex-1 px-5 py-8'>

                    {/* Section Heading */}
                    <div className='mb-5'>

                        <div className='
                            inline-flex
                            items-center
                            gap-2
                        '>

                            <p className='
                                text-xs
                                text-gray-500
                            '>
                                MENU
                            </p>

                            <span className='
                                w-6
                                h-[1px]
                                bg-gray-400
                            ' />

                        </div>

                    </div>


                    {/* Menu Items */}
                    <div className='flex flex-col gap-1'>

                        {menuItems.map((item) => {

                            const Icon = item.icon

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) => `
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        px-2
                                        py-2.5
                                        text-sm
                                        transition-all
                                        duration-200
                                        ${
                                            isActive
                                                ? 'text-black font-medium'
                                                : 'text-gray-500 hover:text-black'
                                        }
                                    `}
                                >

                                    {({ isActive }) => (
                                        <>

                                            {/* Active Line */}
                                            <span
                                                className={`
                                                    w-[2px]
                                                    h-4
                                                    transition-all
                                                    duration-200
                                                    ${
                                                        isActive
                                                            ? 'bg-black'
                                                            : 'bg-transparent group-hover:bg-gray-300'
                                                    }
                                                `}
                                            />

                                            <Icon
                                                size={17}
                                                strokeWidth={1.5}
                                            />

                                            <span>
                                                {item.name}
                                            </span>

                                            {/* Notification Count */}
                                            {item.name === 'Notifications' && (
                                                <span className='
                                                    ml-auto
                                                    text-[10px]
                                                    text-gray-500
                                                '>
                                                    3
                                                </span>
                                            )}

                                        </>
                                    )}

                                </NavLink>
                            )

                        })}

                    </div>

                </nav>


                {/* Bottom */}
                <div className='
                    border-t
                    border-gray-100
                    px-5
                    py-5
                '>

                    <div className='mb-5'>

                        <p className='
                            text-sm
                            text-gray-800
                        '>
                            {user?.name || 'Admin'}
                        </p>

                        <p className='
                            text-xs
                            text-gray-500
                            mt-1
                        '>
                            PD Furniture
                        </p>

                    </div>

                    <button
                        onClick={logout}
                        className='
                            flex
                            items-center
                            gap-3
                            text-sm
                            text-gray-500
                            hover:text-black
                            transition
                        '
                    >

                        <LogOut
                            size={17}
                            strokeWidth={1.5}
                        />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>
        </>
    )
}

export default Sidebar