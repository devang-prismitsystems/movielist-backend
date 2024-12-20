import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Utils } from '../utils/utils';

const md5 = require("md5");
const prisma = new PrismaClient();

const decodeKey = async (key: any) => {
    const decryptedKey = await prisma.users.findUnique({ where: { id: parseInt(Utils.decrypt(key)) } });
    if (!decryptedKey) {
        return false
    } else {
        return decryptedKey;
    }
}

const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const existUser = await prisma.users.findUnique({
            where: {
                email: email
            }
        });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        const createUser = await prisma.users.create({
            data: {
                email,
                password: md5(password)
            }
        });
        res.status(200).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error: any) {
        console.log('error: ', error);
        if (error.code === 'P2002') {
            res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An error occurred"
            });
        }
    }
}

const login = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const user: any = await prisma.users.findFirst({ where: { email: email, password: md5(password) } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = await Utils.encrypt(user.id.toString());
        res.status(200).json({
            success: true,
            data: user.user,
            token: token,
            message: "Login successfully"
        });
    } catch (error: any) {
        console.log('error: ', error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
}

const userProfile = async (req: any, res: Response) => {
    try {
        const { password, ...user } = req.user
        res.status(200).json({
            success: true,
            data: { ...user },
            message: "User fetched successfully"
        });
    } catch (error: any) {
        console.log('error: ', error);
        res.status(500).json({
            success: false,
            message: "An error occurred"
        });
    }
}

module.exports = { decodeKey, signup, login, userProfile };