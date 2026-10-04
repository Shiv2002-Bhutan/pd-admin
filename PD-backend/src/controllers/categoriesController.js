import pool from '../config/db.js'

export const getCategories = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name ASC'
        )

        res.json(result.rows)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch categories.' })
    }
}