import { saveFile } from '../services/storageService.js'

export const uploadImage = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' })
    }

    try {

        const url = await saveFile(req.file)

        res.status(201).json({ url })

    } catch (error) {

        console.error(error)
        res.status(500).json({ message: 'Failed to upload image.' })
    }
}