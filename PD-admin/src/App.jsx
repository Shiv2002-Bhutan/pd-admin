import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import Login from './pages/Login'
import Items from './pages/Items'
import POS from './pages/POS'
import Notification from './pages/Notification'
import Analytics from './pages/Analytics'

const AppLayout = ({ isOpen, setIsOpen }) => (

    <div className='min-h-screen bg-white'>

        <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        />

        <div className='lg:ml-64 min-h-screen'>

            <Topbar
                setIsOpen={setIsOpen}
            />

            <main className='px-4 sm:px-6 lg:px-10 py-8'>

                <Routes>

                    <Route
                        path='/'
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                                <Items />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/pos'
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                                <POS />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/notification'
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                                <Notification />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/analytics'
                        element={
                            <ProtectedRoute allowedRoles={['super_admin']}>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />

                </Routes>

            </main>

        </div>

    </div>
)

const App = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <AuthProvider>

            <Routes>

                <Route
                    path='/login'
                    element={<Login />}
                />

                <Route
                    path='/*'
                    element={
                        <AppLayout
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    }
                />

            </Routes>

        </AuthProvider>
    )
}

export default App