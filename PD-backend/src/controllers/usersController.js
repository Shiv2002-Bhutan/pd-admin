import bcrypt from 'bcrypt'
import pool from '../config/db.js'

export const getUsers = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC'
        )

        res.json(result.rows)

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to fetch users.' })
    }
}

export const createUser = async (req, res) => {

    const { username, password, name } = req.body

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'All fields are required.' })
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    try {

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await pool.query(
            `INSERT INTO users (username, password_hash, name, role, must_change_password)
             VALUES ($1, $2, $3, 'admin', true)
             RETURNING id, username, name, role, created_at`,
            [username.trim(), passwordHash, name.trim()]
        )

        res.status(201).json(result.rows[0])

    } catch (error) {

        if (error.code === '23505') {
            return res.status(409).json({ message: 'That username is already taken.' })
        }

        console.error(error)
        res.status(500).json({ message: 'Failed to create user.' })
    }
}