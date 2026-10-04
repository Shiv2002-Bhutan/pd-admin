import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ArchiveAlert from './components/ArchiveAlert'

import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'
import Items from './pages/Items'
import POS from './pages/POS'
import Notification from './pages/Notification'
import Analytics from './pages/Analytics'
import Users from './pages/Users'
import Reports from './pages/Reports'


const AppLayout = ({ isOpen, setIsOpen }) => {

    const { user } = useAuth()

    if (user?.mustChangePassword) {
        return <Navigate to="/change-password" replace />
    }

    return (
        <div className="min-h-screen bg-white">

            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />

            <div className="lg:ml-64 min-h-screen">

                <Topbar
                    setIsOpen={setIsOpen}
                />

                {/* Archive download alert */}
                <ArchiveAlert />

                <main className="px-4 sm:px-6 lg:px-10 py-8">

                    <Routes>

                        {/* Default landing page */}
                        <Route
                            path="/"
                            element={<Navigate to="/pos" replace />}
                        />

                        {/* POS */}
                        <Route
                            path="/pos"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['admin', 'super_admin']}
                                >
                                    <POS />
                                </ProtectedRoute>
                            }
                        />

                        {/* Notifications */}
                        <Route
                            path="/notification"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['admin', 'super_admin']}
                                >
                                    <Notification />
                                </ProtectedRoute>
                            }
                        />

                        {/* Items — Super Admin only */}
                        <Route
                            path="/items"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['super_admin']}
                                >
                                    <Items />
                                </ProtectedRoute>
                            }
                        />

                        {/* Reports — Super Admin only */}
                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['super_admin']}
                                >
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />

                        {/* Analytics — Super Admin only */}
                        <Route
                            path="/analytics"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['super_admin']}
                                >
                                    <Analytics />
                                </ProtectedRoute>
                            }
                        />

                        {/* Users — Super Admin only */}
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute
                                    allowedRoles={['super_admin']}
                                >
                                    <Users />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>

                </main>

            </div>

        </div>
    )
}


const App = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <AuthProvider>

            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Forced password change */}
                <Route
                    path="/change-password"
                    element={<ChangePassword forced />}
                />

                {/* Protected application */}
                <Route
                    path="/*"
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