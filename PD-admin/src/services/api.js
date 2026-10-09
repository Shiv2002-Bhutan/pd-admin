const BASE_URL = import.meta.env.VITE_API_URL

// ============================================================
// AUTH / REQUEST HELPERS
// ============================================================

const getToken = () => localStorage.getItem('token')

const request = async (path, options = {}) => {
    const token = getToken()

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        }
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data?.message || 'Something went wrong.'
        throw new Error(message)
    }

    return data
}

// ============================================================
// FILE UPLOAD
// ============================================================

// Do NOT set Content-Type manually for FormData.
// The browser automatically adds multipart/form-data
// with the correct boundary.

const uploadRequest = async (path, formData) => {
    const token = getToken()

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const message = data?.message || 'Upload failed.'
        throw new Error(message)
    }

    return data
}

// ============================================================
// AUTH
// ============================================================

export const login = (username, password) =>
    request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        })
    })

export const changePassword = (currentPassword, newPassword) =>
    request('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    })

// ============================================================
// CATEGORIES
// ============================================================

export const getCategories = () =>
    request('/api/categories')

// ============================================================
// ITEMS
// ============================================================

export const getItems = () =>
    request('/api/items')

export const getLowStockItems = () =>
    request('/api/items/low-stock')

export const createItem = (item) =>
    request('/api/items', {
        method: 'POST',
        body: JSON.stringify(item)
    })

export const updateItem = (id, item) =>
    request(`/api/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item)
    })

export const addStock = (id, quantity) =>
    request(`/api/items/${id}/stock`, {
        method: 'POST',
        body: JSON.stringify({
            quantity
        })
    })

// ============================================================
// SALES
// ============================================================

export const createSale = (items) =>
    request('/api/sales', {
        method: 'POST',
        body: JSON.stringify({
            items
        })
    })

// ============================================================
// ANALYTICS
// ============================================================

export const getAnalyticsSummary = () =>
    request('/api/analytics/summary')

export const getAnalyticsSales = () =>
    request('/api/analytics/sales')

// ============================================================
// USERS
// ============================================================

export const getUsers = () =>
    request('/api/users')

export const createUser = (user) =>
    request('/api/users', {
        method: 'POST',
        body: JSON.stringify(user)
    })


export const deleteUser = (id) =>
    request(`/api/users/${id}`, {
        method: 'DELETE'
    })

// ============================================================
// IMAGES
// ============================================================

export const uploadImage = (file) => {
    const formData = new FormData()

    formData.append('image', file)

    return uploadRequest('/api/images', formData)
}

// ============================================================
// POS ARCHIVES / REPORTS
// ============================================================

// Get monthly POS archives
export const getArchives = () =>
    request('/api/reports')

// Download encrypted/password-protected PDF.
//
// This MUST NOT use request(), because request() attempts
// to parse the response as JSON.
//
// The backend should return:
// Content-Type: application/pdf
//
// The browser receives the PDF as a Blob.

export const downloadArchivePdf = async (id) => {
    const token = getToken()

    if (!id) {
        throw new Error('Archive ID is required.')
    }

    const response = await fetch(
        `${BASE_URL}/api/reports/${id}/download`,
        {
            method: 'GET',
            headers: {
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {})
            }
        }
    )

    if (!response.ok) {
        const data = await response.json().catch(() => null)

        throw new Error(
            data?.message || 'Failed to download report.'
        )
    }

    return response.blob()
}