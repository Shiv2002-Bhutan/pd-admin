import pool from '../config/db.js'

export const getSummary = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                COALESCE(SUM(total) FILTER (
                    WHERE created_at >= date_trunc('day', now())
                ), 0) AS today_revenue,
                COUNT(*) FILTER (
                    WHERE created_at >= date_trunc('day', now())
                ) AS today_count,

                COALESCE(SUM(total) FILTER (
                    WHERE created_at >= now() - interval '6 days'
                ), 0) AS week_revenue,
                COUNT(*) FILTER (
                    WHERE created_at >= now() - interval '6 days'
                ) AS week_count,

                COALESCE(SUM(total) FILTER (
                    WHERE created_at >= date_trunc('month', now())
                ), 0) AS month_revenue,
                COUNT(*) FILTER (
                    WHERE created_at >= date_trunc('month', now())
                ) AS month_count
            FROM sales
        `)

        const row = result.rows[0]

        res.json({
            today: {
                revenue: Number(row.today_revenue),
                count: Number(row.today_count)
            },
            week: {
                revenue: Number(row.week_revenue),
                count: Number(row.week_count)
            },
            month: {
                revenue: Number(row.month_revenue),
                count: Number(row.month_count)
            }
        })

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch analytics summary.' })
    }
}

export const getSalesWithItems = async (req, res) => {

    try {

        const salesResult = await pool.query(
            `SELECT sales.*, users.username AS performed_by
             FROM sales
             LEFT JOIN users ON users.id = sales.created_by
             ORDER BY sales.created_at DESC`
        )

        const sales = salesResult.rows

        if (sales.length === 0) {
            return res.json([])
        }

        const saleIds = sales.map((sale) => sale.id)

        const itemsResult = await pool.query(
            'SELECT * FROM sale_items WHERE sale_id = ANY($1)',
            [saleIds]
        )

        const itemsBySaleId = itemsResult.rows.reduce((groups, item) => {

            if (!groups[item.sale_id]) {
                groups[item.sale_id] = []
            }

            groups[item.sale_id].push({
                name: item.name,
                price: Number(item.price),
                quantity: item.quantity
            })

            return groups
        }, {})

        const salesWithItems = sales.map((sale) => ({
            id: sale.id,
            total: Number(sale.total),
            createdAt: sale.created_at,
            performedBy: sale.performed_by || 'Unknown',
            items: itemsBySaleId[sale.id] || []
        }))

        res.json(salesWithItems)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch sales.' })
    }
}