import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

export const login = async (req, res) => {

    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' })
    }

    try {

        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' })
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash)

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid username or password.' })
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        )

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
                mustChangePassword: user.must_change_password
            }
        })

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Login failed.' })
    }
}

export const changePassword = async (req, res) => {

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current and new password required.' })
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters.' })
    }

    try {

        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.user.id]
        )

        const user = result.rows[0]

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const currentMatches = await bcrypt.compare(currentPassword, user.password_hash)

        if (!currentMatches) {
            return res.status(401).json({ message: 'Current password is incorrect.' })
        }

        const newHash = await bcrypt.hash(newPassword, 10)

        await pool.query(
            `UPDATE users SET
                password_hash = $1,
                must_change_password = false
             WHERE id = $2`,
            [newHash, user.id]
        )

        res.json({ message: 'Password changed successfully.' })

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to change password.' })
    }
}