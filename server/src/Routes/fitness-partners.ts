import { Router } from 'express'
import ErrorProtectedRoute from "../utils/error-protected-route";
import { ResponseData } from "../utils/response-data";
import { FitnessPartnerModel } from "../models/fitness-partner";
import ApiError from '../utils/api-error';
import { RequestFilter } from '../middlewares';

export const FitnessRoutes = Router()

FitnessRoutes.post('/', RequestFilter(['_id']), ErrorProtectedRoute(async (req, res) => {
    try {
        await FitnessPartnerModel.create(req.body)
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            throw new ApiError("0011", 400, "User already exists")
        } else {
            throw err
        }
    }
    //Jwt middleware left
    res.send(ResponseData.get("0000"));
}))

