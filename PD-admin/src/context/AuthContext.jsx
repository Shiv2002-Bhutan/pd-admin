import React, { createContext, useContext, useState, useEffect } from 'react'

import { login as loginRequest } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)

    }, [])

    const login = async (username, password) => {

        const data = await loginRequest(username, password)

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        setUser(data.user)
    }

    const refreshUser = (updates) => {

        setUser((previous) => {

            const updated = { ...previous, ...updates }

            localStorage.setItem('user', JSON.stringify(updated))

            return updated
        })
    }

    const logout = () => {

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)