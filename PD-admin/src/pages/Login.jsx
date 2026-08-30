import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'

import { useAuth } from '../context/AuthContext'

const Login = () => {

    const navigate = useNavigate()
    const { login } = useAuth()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {

        event.preventDefault()

        setError('')

        if (!username.trim() || !password.trim()) {
            setError('Enter both username and password.')
            return
        }

        setLoading(true)

        try {

            // TEMP — replace with real POST /api/auth/login later.
            // Backend will validate credentials and return { token, user: { name, role } }
            await login(username.trim(), password)

            navigate('/')

        } catch (err) {

            setError('Invalid username or password.')

        } finally {

            setLoading(false)
        }
    }

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-white
            px-4
        ">

            <div className="
                w-full
                max-w-sm
            ">

                <div className="
                    inline-flex
                    items-center
                    gap-2
                    mb-2
                ">

                    <p className="
                        text-gray-500
                        text-sm
                    ">
                        WELCOME BACK
                    </p>

                    <span className="
                        w-8
                        h-px
                        bg-gray-700
                    "/>

                </div>

                <h1 className="
                    text-2xl
                    font-medium
                    text-gray-900
                    mb-8
                ">
                    Sign in
                </h1>

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        ">
                            Username
                        </label>

                        <div className="relative">

                            <User
                                size={16}
                                strokeWidth={1.5}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                value={username}
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                                placeholder="Enter your username"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    pl-10
                                    pr-4
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            />

                        </div>

                    </div>

                    <div className="mb-6">

                        <label className="
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        ">
                            Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={16}
                                strokeWidth={1.5}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    pl-10
                                    pr-4
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            />

                        </div>

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

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            bg-black
                            text-white
                            py-3
                            text-sm
                            hover:bg-gray-800
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default Login