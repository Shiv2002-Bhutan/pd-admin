import pool from '../config/db.js'

export const getPublicProductList = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT
                items.id,
                items.name,
                items.sub_category,
                items.brand,
                items.image_url,
                categories.name AS category
             FROM items
             LEFT JOIN categories ON categories.id = items.category_id
             ORDER BY items.created_at DESC`
        )

        // deliberately exposes ONLY the fields this public catalog needs —
        // never price, stock, or low_stock_threshold
        const products = result.rows.map((item) => ({
            _id: String(item.id),
            name: item.name,
            category: item.category || '',
            subCategory: item.sub_category || '',
            brand: item.brand || '',
            image: item.image_url
                ? [`${process.env.PUBLIC_ASSET_BASE_URL || ''}${item.image_url}`]
                : []
        }))

        res.json({
            success: true,
            products
        })

    } catch (error) {

        console.error(error)

        res.status(500).json({
            success: false,
            message: 'Unable to load products.'
        })
    }
}