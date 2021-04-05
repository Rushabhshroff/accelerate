import { Router } from 'express'
import ErrorProtectedRoute from "../Utils/ErrorProtectedRoute";
import ResponseData from "../Utils/ResponseData";
import { UserModel } from "../Models/User";
import ApiError from '../Utils/ApiError';

const UserRoutes = Router()

UserRoutes.post('/', ErrorProtectedRoute(async (req, res) => {
    delete req.body._id;
    console.log("called")
    if(await UserModel.findOne({ email: req.body.email}))
        throw new ApiError("0011", 400, "User already exists")
    else{
        UserModel.create(req.body)
    }
    //Jwt middleware left
    res.send(ResponseData.get("0000"));
}))

export default UserRoutes