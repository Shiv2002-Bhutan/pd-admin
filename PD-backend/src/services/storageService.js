import fs from 'fs'
import path from 'path'

const uploadDir = path.join(process.cwd(), 'uploads')

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

// TODAY: saves the file to local disk, returns a relative URL path.
// LATER (cloud bucket): replace this function's body to upload
// req.file.buffer to S3/Cloudinary/etc. and return the resulting
// public URL instead. Nothing outside this file needs to change.
export const saveFile = async (file) => {

    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`

    const filePath = path.join(uploadDir, uniqueName)

    fs.writeFileSync(filePath, file.buffer)

    return `/uploads/${uniqueName}`
}