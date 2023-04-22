import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import user from "./routes/user.js"
import UserController from "./controllers/user.js"

dotenv.config()
const app = express()
const PORT = process.env.PORT
const HOST = process.env.HOST
const MONGO = process.env.MONGO
const SOCKET_PORT = process.env.SOCKET_PORT
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).json({ message: 'Server working' })
})

app.use('/user', user)

// -------- socket --------

import http from "http"
import { Server } from "socket.io"

let cache = new Map()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

io.on('connection', (socket) => {
    socket.on("connected", (_id) => {
        console.log(socket.id + ' : connection\n  key : ' + _id)
        socket.join(_id)
        cache.set(socket.id, _id)
    })
    socket.on("disconnect", function () {
        socket.leave(cache.get(socket.id))
        cache.delete(socket.id)
        console.log(socket.id + " : disconnected")
    })
})

// ------ socket end ------

// ------- s3 bucket --------

import S3 from "aws-sdk/clients/s3.js"
import busboy from "busboy"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"

app.post('/upload', async (req, res) => {
    try {
        const bb = busboy({ headers: req.headers })
        const s3 = new S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })
        bb.on('file', function (fieldname, file, filename) {
            const key = uuidv4()
            const params = JSON.parse(decodeURI(fieldname))
            console.log(params)
            let current = 0, total = req.headers['content-length']
            file.on('data', function (chunk) {
                current += chunk.length
                let x = ((current / total) * 100).toFixed(2)
                console.log('transfer Progress : ' + x + '%')
                io.sockets.to(params.group_id).emit('transfer', {
                    progress: x
                })
            })
            file.on('end', function () {
                console.log('transfer completed')
                io.sockets.to(params.group_id).emit('transferComplete')
            })
            const __file = s3.upload({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'secure/' + key,
                Body: file,
                ContentType: filename.mimeType
            })
            __file.on('httpUploadProgress', function (progress) {
                let x = (progress.loaded / progress.total * 100).toFixed(2)
                console.log('Upload Progress : ' + x + '%')
                io.sockets.to(params.group_id).emit('upload', {
                    progress: x
                })
            })
            __file.send(async function (err, data) {
                console.log(data, err)
                console.log(filename)
                const userCtrl = UserController()
                await userCtrl.createFolder({
                    ...params,
                    folder_name: filename.filename,
                    link: data.Location,
                    directory: false
                })
                io.sockets.to(params.group_id).emit('finish', {
                    status: data
                })
            })
        })
        req.pipe(bb)
    } catch (err) {
        res.status(401).json({ status: "failed" })
    }
})

// -------- s3 end --------

mongoose.connect(MONGO)
    .then(() => {
        app.listen(PORT, () => {
            console.log('\n\n ----- mongo connection established -----')
            console.log(` ----- server http://${HOST}:${PORT} -----`)
            server.listen(SOCKET_PORT, () => console.log(` ----- socket http://${HOST}:${SOCKET_PORT} -----\n`))
        })
    })
    .catch(error => {
        console.log(error)
        console.log('error DB not connected')
    })
