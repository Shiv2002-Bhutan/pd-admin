const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

// ============================================================
// AUTH / REQUEST HELPERS
// ============================================================

const getToken = () => localStorage.getItem('token')

const authHeader = () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
}

// Shared fetch wrapper: handles network errors and expired sessions.
const send = async (path, options = {}, fallbackMessage = 'Something went wrong.') => {
    let response

    try {
        response = await fetch(`${BASE_URL}${path}`, options)
    } catch {
        throw new Error('Network error. Please check your connection.')
    }

    if (!response.ok) {
        const data = await response.json().catch(() => null)

        // Expired/invalid token on a protected call (not the login call itself)
        if (response.status === 401 && getToken()) {
            localStorage.removeItem('token')
            window.dispatchEvent(new Event('auth:expired'))
        }

        throw new Error(data?.message || fallbackMessage)
    }

    return response
}

const request = async (path, options = {}) => {
    const hasBody = options.body !== undefined

    const response = await send(path, {
        ...options,
        headers: {
            // Only send Content-Type when there is a JSON body
            // (avoids needless CORS preflights on GET/DELETE)
            ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
            ...authHeader(),
            ...options.headers
        }
    })

    // Handles 204 No Content and non-JSON bodies safely
    return response.json().catch(() => null)
}

const jsonBody = (method, body) => ({
    method,
    body: JSON.stringify(body)
})

// ============================================================
// FILE UPLOAD
// ============================================================
// Do NOT set Content-Type for FormData; the browser adds the
// multipart boundary automatically.

const uploadRequest = async (path, formData) => {
    const response = await send(
        path,
        {
            method: 'POST',
            headers: authHeader(),
            body: formData
        },
        'Upload failed.'
    )

    return response.json().catch(() => null)
}

// ============================================================
// AUTH
// ============================================================

export const login = (username, password) =>
    request('/api/auth/login', jsonBody('POST', { username, password }))

export const changePassword = (currentPassword, newPassword) =>
    request('/api/auth/change-password', jsonBody('PUT', { currentPassword, newPassword }))

// ============================================================
// CATEGORIES
// ============================================================

export const getCategories = () => request('/api/categories')

// ============================================================
// ITEMS
// ============================================================

export const getItems = () => request('/api/items')

export const getLowStockItems = () => request('/api/items/low-stock')

export const createItem = (item) =>
    request('/api/items', jsonBody('POST', item))

export const updateItem = (id, item) =>
    request(`/api/items/${encodeURIComponent(id)}`, jsonBody('PUT', item))

export const addStock = (id, quantity) =>
    request(`/api/items/${encodeURIComponent(id)}/stock`, jsonBody('POST', { quantity }))

// ============================================================
// SALES
// ============================================================

export const createSale = (items) =>
    request('/api/sales', jsonBody('POST', { items }))

// ============================================================
// ANALYTICS
// ============================================================

export const getAnalyticsSummary = () => request('/api/analytics/summary')

export const getAnalyticsSales = () => request('/api/analytics/sales')

// ============================================================
// USERS
// ============================================================

export const getUsers = () => request('/api/users')

export const createUser = (user) =>
    request('/api/users', jsonBody('POST', user))

export const deleteUser = (id) =>
    request(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' })

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

export const getArchives = () => request('/api/reports')

// Returns the PDF as a Blob (must not go through request(), which parses JSON).
export const downloadArchivePdf = async (id) => {
    if (!id) {
        throw new Error('Archive ID is required.')
    }

    const response = await send(
        `/api/reports/${encodeURIComponent(id)}/download`,
        { method: 'GET', headers: authHeader() },
        'Failed to download report.'
    )

    return response.blob()
}