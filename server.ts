import * as path from 'path'
import cloudinary from 'cloudinary'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import express from 'express'
import 'express-async-errors'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import mongoose from 'mongoose'
import morgan from 'morgan'

// Routers
import authRouter from './routers/authRouter'
import jobRouter from './routers/jobRouter'
import userRouter from './routers/userRouter'

// Middlewares
import { authenticateUser } from './middleware/authMiddleware'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware'

dotenv.config()
const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(cookieParser())
app.use(express.json())

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

// Public
app.use(express.static(path.resolve(__dirname, './client/dist')))

// Security
app.use(helmet())
app.use(mongoSanitize())

//@ts-ignore
app.use('/api/v1/jobs', authenticateUser, jobRouter)

//@ts-ignore
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/auth', authRouter)

app.all('*', (req, res) => {
    res.status(404).json({ message: 'Page not found' })
})

// Serve the client
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

//@ts-ignore
app.use(errorHandlerMiddleware)

const port = 11000 /* process.env.PORT || 11000; */

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((error) => {
        console.error(error)
    })

export default app