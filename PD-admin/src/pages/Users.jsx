import React, { useState, useEffect } from 'react'
import { UserPlus, Users as UsersIcon } from 'lucide-react'

import { getUsers, createUser } from '../services/api'
import Toast from '../components/Toast'

const Users = () => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [form, setForm] = useState({
        username: '',
        password: '',
        name: ''
    })

    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [toast, setToast] = useState(null)

    const fetchUsers = async () => {

        setLoading(true)
        setLoadError('')

        try {

            const data = await getUsers()

            setUsers(data)

        } catch (err) {

            console.error(err)
            setLoadError('Could not load users.')

        } finally {

            setLoading(false)
        }
    }

    useEffect(() => {

        fetchUsers()

    }, [])

    const handleChange = (e) => {

        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        setFormError('')

        if (!form.username.trim() || !form.password || !form.name.trim()) {
            setFormError('Please fill in all fields.')
            return
        }

        if (form.password.length < 8) {
            setFormError('Password must be at least 8 characters.')
            return
        }

        setSubmitting(true)

        try {

            await createUser({
                username: form.username.trim(),
                password: form.password,
                name: form.name.trim()
            })

            setForm({
                username: '',
                password: '',
                name: ''
            })

            setToast({
                type: 'success',
                message: 'Account created. They must change their password on first login.'
            })

            fetchUsers()

        } catch (err) {

            console.error(err)
            setFormError(err.message || 'Failed to create account.')

        } finally {

            setSubmitting(false)
        }
    }

    const formatDate = (isoString) =>
        new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })

    return (
        <div className="w-full">

            {/* HEADER */}

            <div className="mb-8">

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
                        SUPER ADMIN
                    </p>

                    <span className="
                        w-8
                        h-px
                        bg-gray-700
                    "/>

                </div>

                <h1 className="
                    text-2xl
                    sm:text-3xl
                    font-medium
                    text-gray-900
                ">
                    User Accounts
                </h1>

                <p className="
                    text-sm
                    text-gray-500
                    mt-2
                ">
                    Create and manage admin accounts.
                </p>

            </div>


            <div className="
                grid
                grid-cols-1
                lg:grid-cols-[1fr_380px]
                gap-6
                items-start
            ">

                {/* USER LIST */}

                <div>

                    <div className="
                        flex
                        items-center
                        gap-2
                        mb-4
                    ">

                        <UsersIcon
                            size={16}
                            strokeWidth={1.5}
                            className="text-gray-500"
                        />

                        <p className="
                            text-sm
                            text-gray-900
                        ">
                            All Accounts
                        </p>

                    </div>

                    {loadError && (

                        <div className="
                            border
                            border-gray-300
                            px-5
                            py-4
                            mb-4
                        ">

                            <p className="
                                text-sm
                                text-gray-700
                            ">
                                {loadError}
                            </p>

                        </div>

                    )}

                    <div className="
                        border
                        border-gray-200
                    ">

                        {loading ? (

                            <p className="
                                text-sm
                                text-gray-400
                                px-5
                                py-8
                                text-center
                            ">
                                Loading...
                            </p>

                        ) : (

                            <>

                                {users.map((user) => (

                                    <div
                                        key={user.id}
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-4
                                            px-5
                                            py-4
                                            border-b
                                            border-gray-100
                                            last:border-b-0
                                        "
                                    >

                                        <div>

                                            <p className="
                                                text-sm
                                                text-gray-900
                                            ">
                                                {user.name}
                                            </p>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                                mt-1
                                            ">
                                                @{user.username}
                                                {' · '}
                                                Joined {formatDate(user.created_at)}
                                            </p>

                                        </div>

                                        <span className={
                                            user.role === 'super_admin'
                                                ? 'text-xs px-2.5 py-1 border border-black text-black'
                                                : 'text-xs px-2.5 py-1 border border-gray-300 text-gray-600'
                                        }>
                                            {user.role === 'super_admin'
                                                ? 'Super Admin'
                                                : 'Admin'}
                                        </span>

                                    </div>

                                ))}

                                {users.length === 0 && (

                                    <p className="
                                        text-sm
                                        text-gray-400
                                        px-5
                                        py-8
                                        text-center
                                    ">
                                        No accounts yet.
                                    </p>

                                )}

                            </>

                        )}

                    </div>

                </div>


                {/* CREATE FORM */}

                <div className="
                    border
                    border-gray-200
                    p-5
                ">

                    <div className="
                        flex
                        items-center
                        gap-2
                        mb-5
                    ">

                        <UserPlus
                            size={16}
                            strokeWidth={1.5}
                            className="text-gray-500"
                        />

                        <p className="
                            text-sm
                            text-gray-900
                        ">
                            New Account
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-4">

                            <label className="
                                block
                                text-xs
                                text-gray-500
                                mb-2
                            ">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Tashi Wangmo"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            />

                        </div>

                        <div className="mb-4">

                            <label className="
                                block
                                text-xs
                                text-gray-500
                                mb-2
                            ">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            />

                        </div>

                        <div className="mb-5">

                            <label className="
                                block
                                text-xs
                                text-gray-500
                                mb-2
                            ">
                                Temporary Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="At least 8 characters"
                                className="
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                "
                            />

                            <p className="
                                text-xs
                                text-gray-400
                                mt-2
                            ">
                                They'll be required to change this on first login.
                            </p>

                        </div>

                        {formError && (

                            <p className="
                                text-xs
                                text-black
                                mb-4
                            ">
                                {formError}
                            </p>

                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="
                                w-full
                                bg-black
                                text-white
                                py-2.5
                                text-sm
                                hover:bg-gray-800
                                transition
                                disabled:opacity-50
                            "
                        >
                            {submitting ? 'Creating...' : 'Create Account'}
                        </button>

                    </form>

                </div>

            </div>


            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

        </div>
    )
}

export default Users