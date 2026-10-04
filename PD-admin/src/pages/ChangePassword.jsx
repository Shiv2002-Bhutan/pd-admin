import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck } from 'lucide-react'

import { changePassword } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ChangePassword = ({ forced = false }) => {

    const navigate = useNavigate()
    const { user, refreshUser, logout } = useAuth()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.')
            return
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters.')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.')
            return
        }

        setSubmitting(true)

        try {

            await changePassword(currentPassword, newPassword)

            refreshUser({ mustChangePassword: false })

            navigate('/')

        } catch (err) {

            console.error(err)
            setError(err.message || 'Failed to change password.')

        } finally {

            setSubmitting(false)
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

            <div className="w-full max-w-sm">

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
                        {forced ? 'REQUIRED' : 'ACCOUNT'}
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
                    mb-2
                ">
                    Change Password
                </h1>

                {forced && (

                    <p className="
                        text-sm
                        text-gray-500
                        mb-8
                        leading-relaxed
                    ">
                        For security, you must set a new password
                        before continuing.
                    </p>

                )}

                {!forced && (

                    <p className="
                        text-sm
                        text-gray-500
                        mb-8
                    ">
                        Update the password for {user?.name}.
                    </p>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">

                        <label className="
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        ">
                            Current Password
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
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
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

                    <div className="mb-5">

                        <label className="
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        ">
                            New Password
                        </label>

                        <div className="relative">

                            <ShieldCheck
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
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="At least 8 characters"
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
                            Confirm New Password
                        </label>

                        <div className="relative">

                            <ShieldCheck
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
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
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
                        disabled={submitting}
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
                        {submitting ? 'Saving...' : 'Set New Password'}
                    </button>

                    {forced && (

                        <button
                            type="button"
                            onClick={logout}
                            className="
                                w-full
                                text-xs
                                text-gray-500
                                hover:text-black
                                mt-4
                            "
                        >
                            Log out instead
                        </button>

                    )}

                </form>

            </div>

        </div>
    )
}

export default ChangePassword