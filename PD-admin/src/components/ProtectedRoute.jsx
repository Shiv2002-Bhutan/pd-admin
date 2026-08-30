import React from 'react'
import { Navigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {

    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const allowed = allowedRoles.includes(user.role)

    if (!allowed) {

        return (
            <div className="
                py-24
                text-center
            ">

                <ShieldAlert
                    size={28}
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
                    You don't have access to this page.
                </p>

            </div>
        )
    }

    return children
}

export default ProtectedRoute