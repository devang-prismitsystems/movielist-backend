import path from "path";
import fs from 'fs';
const crypto = require("crypto");
const algorithm = 'aes-256-cbc';
const key = Buffer.from('01234567890123456789012345678901', 'utf8');
const iv = Buffer.from('0123456789012345', 'utf8');
const cloudinary = require('cloudinary').v2;

export class Utils {

    static getExtension(mimetype: string): string | null {
        switch (mimetype) {
            case 'image/jpeg':
                return '.jpg';
            case 'image/png':
                return '.png';
            case 'image/gif':
                return '.gif';
            case 'image/webp':
                return '.webp';
            default:
                return '.jpg';
        }
    }

    static decrypt = (encryptedText: any) => {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    };

    static encrypt = (text: any) => {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        while (encrypted.length < 8) {
            encrypted += '=';
        }
        return encrypted;
    };

    static genrateRandomNumber = () => {
        let minm = 100000;
        let maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }
    static imageUpload = async (image: any, res: any) => {
        try {
            const b64 = Buffer.from(image.data).toString("base64");
            let dataURI = `data:${image.mimetype};base64,${b64}`;
            const uploadImage = await cloudinary.uploader.upload(dataURI, { folder: "Movie-poster" });
            if (!uploadImage || !uploadImage.secure_url) {
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
            return uploadImage.secure_url
        } catch (error) {
            console.log('error: ', error);
        }
    }
    static uploadImage = async (image: any, res: any) => {
        console.log('image: ', image);
        const uploadPath = path.join(__dirname, '../../upload/posters');

        const random = Utils.genrateRandomNumber();
        let ext: any;
        let buffer: any;

        if (image.data) {
            const { mimetype } = image;
            ext = Utils.getExtension(mimetype);
            buffer = image.data;
        }

        const filePath = path.join(uploadPath, `${random}${ext}`);
        await fs.promises.writeFile(filePath, buffer).catch((err: any) => {
            console.error(`Error writing file ${random}:`, err);
            res.status(500).send('Error uploading file.');
        });
        return `${random}${ext}`
            ;
    }

}
