import bcrypt from 'bcrypt'
import pool from '../config/db.js'

const seed = async () => {

    const users = [
        {
            username: process.env.SEED_ADMIN_USERNAME,
            password: process.env.SEED_ADMIN_PASSWORD,
            name: 'Admin',
            role: 'admin'
        },
        {
            username: process.env.SEED_SUPERADMIN_USERNAME,
            password: process.env.SEED_SUPERADMIN_PASSWORD,
            name: 'Super Admin',
            role: 'super_admin'
        }
    ]

    for (const user of users) {

        const passwordHash = await bcrypt.hash(user.password, 10)

        await pool.query(
            `INSERT INTO users (username, password_hash, name, role, must_change_password)
             VALUES ($1, $2, $3, $4, true)
             ON CONFLICT (username) DO NOTHING`,
            [user.username, passwordHash, user.name, user.role]
        )
    }

    const categories = [
        'King Koil',
        'Furniture',
        'Clothing',
        'Mattresses',
        'Rubber Wood'
    ]

    for (const name of categories) {

        await pool.query(
            `INSERT INTO categories (name)
             VALUES ($1)
             ON CONFLICT (name) DO NOTHING`,
            [name]
        )
    }

    console.log('Seed complete. Both accounts must change their password on first login.')
    process.exit(0)
}

seed().catch((error) => {
    console.error(error)
    process.exit(1)
})