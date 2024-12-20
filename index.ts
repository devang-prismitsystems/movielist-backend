import express from 'express';
import movieRouter from './src/routes/moviesRoute';
import userRouter from './src/routes/userRoute';
const cloudinary = require('cloudinary').v2;
const imageUpload = require('express-fileupload');

const app = express();

const port = process.env.PORT;
const cors = require('cors');
const morgan = require('morgan');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const corsOptions = {
    origin: ['https://movielist-frontend.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(imageUpload());
app.use(morgan("tiny"));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

app.get("/login", (req, res) => {
    res.status(200).send("Login SuccessFull!");
});

app.get("/", (req, res) => {
    res.status(200).send("Welcome To Movies List");
});

app.use("/movie", movieRouter);
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
