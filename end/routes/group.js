import express from "express"
import dotenv from "dotenv"
import verify from "../utilities/validate.js"
import GroupController from "../controllers/group.js"

const app = express.Router()
const groupCtrl = GroupController()
dotenv.config()

let cache = new Map()

app.route('/create')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { status, result } = await groupCtrl.createGroup(req.body)
        return res.status(status).json(result)
    })

app.route('/get-path')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { email, group_id } = req.body
        if (cache.has(email + group_id)) {
            return res.status(200).json({ path: cache.get(email + group_id) })
        }
        cache.set(email + group_id, '/')
        return res.status(200).json({ path: '/' })
    })

app.route('/set-path')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { email, group_id, path } = req.body
        cache.set(email + group_id, path || '/')
        return res.status(200).json({ path: path || '/' })
    })
app.route('/adduser')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { status, result } = await groupCtrl.addMember(req.body)
        console.log("result ---", result)
        return res.status(status).json(result)
    })

app.route('/getgrp')
    .post(async (req, res) => {
        if (!verify(req.headers)) {
            return res.status(400).json({ message: "not authorized" })
        }
        const { status, result } = await groupCtrl.getGroup(req.body)
        return res.status(status).json(result)
    })

const group = app
export default group
