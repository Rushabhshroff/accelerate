import { Router } from 'express'
import ErrorProtectedRoute from "../Utils/ErrorProtectedRoute";
import ResponseData from "../Utils/ResponseData";
import { UserModel } from "../Models/User";
import ApiError from '../Utils/ApiError';
import { isNamedExportBindings } from 'typescript';

const UserRoutes = Router()

UserRoutes.post('/', ErrorProtectedRoute(async (req, res, next) => {
    delete req.body._id;
    
    if(await UserModel.findOne({ email: req.body.email}))
        throw new ApiError("0011", 400, "User already exists")
    else
    {        
        await UserModel.create(req.body)
    }
    //Jwt middleware left
    res.send(ResponseData.get("0000"));
}))

export default UserRoutes