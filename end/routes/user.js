import express from "express";
import UserController from "../controllers/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verify from "../utilities/validate.js";

const app = express.Router();
const userCtrl = UserController();
dotenv.config();

let cache = new Map();

app.route("/login").post(async (req, res) => {
    let data = await userCtrl.login(req.body);
    if (data) {
        data = JSON.parse(JSON.stringify(data));
        let groups = data.groups;
        delete data.groups;
        let token = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });
        delete data.passwd;
        return res.status(200).json({ jwt: token, ...data, groups });
    }
    return res.status(200).json({ errno: 404, message: "Data not found" });
});

app.route("/register").post(async (req, res) => {
    const { status, result } = await userCtrl.createUser(req.body);
    return res.status(status).json(result);
});

app.route("/get-path").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    const { email } = req.body;
    if (cache.has(email)) {
        return res.status(200).json({ path: cache.get(email) });
    }
    cache.set(email, "/");
    return res.status(200).json({ path: "/" });
});

app.route("/set-path").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    const { email, path } = req.body;
    cache.set(email, path || "/");
    return res.status(200).json({ path: path || "/" });
});

app.route("/get-files").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    const { status, result } = await userCtrl.getfiles(req.body);
    return res.status(status).json(result);
});

app.route("/create-folder").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    const { status, result } = await userCtrl.createFolder(req.body);
    return res.status(status).json(result);
});

app.route("/get-groups").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    const { status, result } = await userCtrl.getUserGroups(req.body);
    return res.status(status).json(result);
});

app.route("/updateprofile").post(async (req, res) => {
    if (!verify(req.headers)) {
        return res.status(400).json({ message: "not authorized" });
    }
    try {
        const { status, result } = await userCtrl.updateProfile(req.body);
        console.log("status", status, "result", result);
        return res.status(status).json(result);
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
})

const user = app;
export default user;
