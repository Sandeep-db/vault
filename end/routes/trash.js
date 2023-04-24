import express from "express"
import dotenv from "dotenv"
import verify from "../utilities/validate.js"
import TrashController from "../controllers/trash.js"

const app = express.Router()
const trashCtrl = TrashController()
dotenv.config()

app.route('/get-folders')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { status, result } = await trashCtrl.getFolders(req.body)
        return res.status(status).json(result)
    })

app.route('/restore-folder')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { status, result } = await trashCtrl.restoreFolders(req.body)
        return res.status(status).json(result)
    })

const trash = app
export default trash