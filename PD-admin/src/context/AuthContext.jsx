import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)

    const login = async (username, password) => {

        // TEMP mock — replace with:
        // const response = await fetch('http://localhost:5000/api/auth/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username, password })
        // })
        // const data = await response.json()
        // if (!response.ok) throw new Error(data.message)
        // localStorage.setItem('token', data.token)
        // setUser(data.user)

        if (username === 'superadmin' && password === 'password') {

            setUser({ name: 'Super Admin', role: 'super_admin' })
            return
        }

        if (username === 'admin' && password === 'password') {

            setUser({ name: 'Admin', role: 'admin' })
            return
        }

        throw new Error('Invalid credentials.')
    }

    const logout = () => {

        setUser(null)
        // localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)