var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import ErrorProtectedRoute from "../Utils/ErrorProtectedRoute";
import ResponseData from "../Utils/ResponseData";
import { UserModel } from "../Models/User";
import ApiError from '../Utils/ApiError';
const UserRoutes = Router();
UserRoutes.post('/', ErrorProtectedRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    delete req.body._id;
    console.log("called");
    if (yield UserModel.findOne({ email: req.body.email }))
        throw new ApiError("0011", 400, "User already exists");
    else {
        UserModel.create(req.body);
    }
    //Jwt middleware left
    res.send(ResponseData.get("0000"));
})));
export default UserRoutes;
