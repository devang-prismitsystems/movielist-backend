import express from 'express';
import movieRouter from './src/routes/moviesRoute';
import userRouter from './src/routes/userRoute';
const cloudinary = require('cloudinary').v2;
const imageUpload = require('express-fileupload');

const app = express();

const port = process.env.PORT;
const cors = require('cors');
const morgan = require('morgan');

const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'https://movielist-frontend.vercel.app/']
};
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(imageUpload());
app.use(morgan("tiny"));
app.use(cors(corsOptions));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/upload', express.static('upload'));

app.use("/movie", movieRouter);
app.use("/user", userRouter);

app.get("/", (req: any, res: any) => {
    res.status(200).send("Welcome To Movies List");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});