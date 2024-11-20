import { Request, NextFunction, Response } from "express";
const { decodeKey } = require("../controllers/userController");

const validateKey = async (req: any, res: Response, next: NextFunction) => {
    try {
        const key = req.headers.authorization.split("Bearer ")[1];
        if (!key) {
            return res.status(401).json({ success: false, message: 'Unauthorized: No key provided' });
        }
        const decodedToken = await decodeKey(key);
        if (!decodedToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }
}

module.exports = { validateKey };