import { Router } from 'express'
import ErrorProtectedRoute from "../Utils/ErrorProtectedRoute";
import ResponseData from "../Utils/ResponseData";
import { FitnessPartnerModel } from "../Models/FitnessPartner";
import ApiError from '../Utils/ApiError';

const FitnessRoutes = Router()

FitnessRoutes.post('/', ErrorProtectedRoute(async (req, res) => {
    delete req.body._id;
    console.log("called")
    if(await FitnessPartnerModel.findOne({ email: req.body.email}))
        throw new ApiError("0011", 400, "User already exists")
    else{
        FitnessPartnerModel.create(req.body)
    }
    //Jwt middleware left
    res.send(ResponseData.get("0000"));
}))

export default FitnessRoutes