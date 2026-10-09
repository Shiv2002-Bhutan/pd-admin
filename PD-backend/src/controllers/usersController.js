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

export const deleteUser = async (req, res) => {

    const { id } = req.params

    try {

        // Delete only if the target is NOT a super admin (enforced in SQL)
        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1 AND role <> 'super_admin'
             RETURNING id`,
            [id]
        )

        if (result.rowCount > 0) {
            return res.json({ message: 'User deleted.' })
        }

        // Nothing deleted: figure out why
        const existing = await pool.query(
            'SELECT role FROM users WHERE id = $1',
            [id]
        )

        if (existing.rowCount === 0) {
            return res.status(404).json({ message: 'User not found.' })
        }

        return res.status(403).json({ message: 'Super admin accounts cannot be deleted.' })

    } catch (error) {

        // invalid id format (e.g. non-numeric / bad UUID)
        if (error.code === '22P02') {
            return res.status(400).json({ message: 'Invalid user id.' })
        }

        // user is referenced by other tables
        if (error.code === '23503') {
            return res.status(409).json({
                message: 'This user has related records and cannot be deleted.'
            })
        }

        console.error(error)
        res.status(500).json({ message: 'Failed to delete user.' })
    }
}