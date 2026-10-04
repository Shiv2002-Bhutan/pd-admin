import pool from '../config/db.js'

const escapeHtml = (text) =>
    String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

export const getProductShare = async (req, res) => {

    const { id } = req.params

    try {

        const result = await pool.query(
            `SELECT items.id, items.name, items.image_url, categories.name AS category
             FROM items
             LEFT JOIN categories ON categories.id = items.category_id
             WHERE items.id = $1`,
            [id]
        )

        const item = result.rows[0]

        if (!item) {
            return res.status(404).send('Product not found.')
        }

        const title = escapeHtml(item.name)
        const description = escapeHtml(
            item.category
                ? `${item.category} · PD Furniture`
                : 'PD Furniture'
        )

        const imageUrl = item.image_url
            ? `${process.env.PUBLIC_ASSET_BASE_URL || ''}${item.image_url}`
            : ''

        const frontendProductUrl = `${process.env.FRONTEND_URL || ''}/product/${item.id}`

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    ${imageUrl ? `<meta property="og:image" content="${imageUrl}">` : ''}
    <meta property="og:type" content="product">

    <meta http-equiv="refresh" content="0; url=${frontendProductUrl}">
</head>
<body>
    <p>Redirecting to <a href="${frontendProductUrl}">${title}</a>...</p>
</body>
</html>`

        res.set('Content-Type', 'text/html')
        res.send(html)

    } catch (error) {

        console.error(error)
        res.status(500).send('Unable to load product.')
    }
}