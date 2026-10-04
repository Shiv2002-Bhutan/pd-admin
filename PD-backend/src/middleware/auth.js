import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {

    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' })
    }

    const token = header.split(' ')[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded  // { id, role }

        next()

    } catch (error) {

        res.status(401).json({ message: 'Invalid or expired token.' })
    }
}

export const requireRole = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied.' })
        }

        next()
    }
}