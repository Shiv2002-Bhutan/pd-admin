import pool from '../config/db.js'

export const createSale = async (req, res) => {

    const { items } = req.body

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Sale must include at least one item.' })
    }

    const client = await pool.connect()

    try {

        await client.query('BEGIN')

        let total = 0

        // Validate stock and lock rows before writing anything
        for (const line of items) {

            const itemResult = await client.query(
                'SELECT * FROM items WHERE id = $1 FOR UPDATE',
                [line.id]
            )

            const item = itemResult.rows[0]

            if (!item) {
                throw new Error(`Item ${line.id} not found.`)
            }

            if (item.stock < line.quantity) {
                throw new Error(`Not enough stock for ${item.name}.`)
            }

            total += line.price * line.quantity
        }

        const saleResult = await client.query(
            'INSERT INTO sales (total, created_by) VALUES ($1, $2) RETURNING *',
            [total, req.user.id]
        )

        const sale = saleResult.rows[0]

        for (const line of items) {

            await client.query(
                `INSERT INTO sale_items (sale_id, item_id, name, price, quantity, subtotal)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [sale.id, line.id, line.name, line.price, line.quantity, line.price * line.quantity]
            )

            await client.query(
                'UPDATE items SET stock = stock - $1, updated_at = now() WHERE id = $2',
                [line.quantity, line.id]
            )
        }

        await client.query('COMMIT')

        res.status(201).json(sale)

    } catch (error) {

        await client.query('ROLLBACK')
        console.error(error)
        res.status(400).json({ message: error.message || 'Failed to record sale.' })

    } finally {

        client.release()
    }
}

export const getSales = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM sales ORDER BY created_at DESC'
        )

        res.json(result.rows)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch sales.' })
    }
}

export const getSaleById = async (req, res) => {

    const { id } = req.params

    try {

        const saleResult = await pool.query(
            'SELECT * FROM sales WHERE id = $1',
            [id]
        )

        if (saleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Sale not found.' })
        }

        const itemsResult = await pool.query(
            'SELECT * FROM sale_items WHERE sale_id = $1',
            [id]
        )

        res.json({
            ...saleResult.rows[0],
            items: itemsResult.rows
        })

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch sale.' })
    }
}