import pool from '../config/db.js'

export const getItems = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT items.*, categories.name AS category
             FROM items
             LEFT JOIN categories ON categories.id = items.category_id
             ORDER BY items.created_at DESC`
        )

        res.json(result.rows)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch items.' })
    }
}

export const getLowStockItems = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT items.*, categories.name AS category
             FROM items
             LEFT JOIN categories ON categories.id = items.category_id
             WHERE items.stock <= items.low_stock_threshold
             ORDER BY items.stock ASC`
        )

        res.json(result.rows)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch low stock items.' })
    }
}

export const createItem = async (req, res) => {

    const {
        name,
        categoryId,
        subCategory,
        brand,
        price,
        stock,
        lowStockThreshold,
        imageUrl
    } = req.body

    if (!name || !price || stock === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' })
    }

    try {

        const result = await pool.query(
            `INSERT INTO items
                (name, category_id, sub_category, brand, price, stock, low_stock_threshold, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [name, categoryId, subCategory, brand, price, stock, lowStockThreshold || 0, imageUrl]
        )

        res.status(201).json(result.rows[0])

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to create item.' })
    }
}

export const updateItem = async (req, res) => {

    const { id } = req.params

    const {
        name,
        categoryId,
        subCategory,
        brand,
        price,
        stock,
        lowStockThreshold,
        imageUrl
    } = req.body

    try {

        const result = await pool.query(
            `UPDATE items SET
                name = $1,
                category_id = $2,
                sub_category = $3,
                brand = $4,
                price = $5,
                stock = $6,
                low_stock_threshold = $7,
                image_url = $8,
                updated_at = now()
             WHERE id = $9
             RETURNING *`,
            [name, categoryId, subCategory, brand, price, stock, lowStockThreshold, imageUrl, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found.' })
        }

        res.json(result.rows[0])

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to update item.' })
    }
}

export const addStock = async (req, res) => {

    const { id } = req.params
    const { quantity } = req.body

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity.' })
    }

    try {

        const result = await pool.query(
            `UPDATE items SET
                stock = stock + $1,
                updated_at = now()
             WHERE id = $2
             RETURNING *`,
            [quantity, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found.' })
        }

        res.json(result.rows[0])

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to add stock.' })
    }
}