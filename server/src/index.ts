import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import ApiError from "./Utils/ApiError"
import ResponseData from "./Utils/ResponseData"
import BodyParser from './Middlewares/BodyParser'
import Routes from './Routes'
import http from 'http';

const app = express()
mongoose.connect("mongodb+srv://test:boul3n9L8iziqoih@test.1smdb.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,    
    useUnifiedTopology: true })

app.use(cors());
app.use(BodyParser);
app.use(Routes);
app.use((err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    if (err.constructor === ApiError && err.name === 'ApiError') {
        res.status(err.responseCode).send(err.toResponseData())
    } else {
        res.status(500).send(ResponseData.fromError(err))
        console.log(err)
    }
})
const server = http.createServer(app);

server.listen(process.env.PORT || 8080, () => {
    console.log("Server Running...")
})
