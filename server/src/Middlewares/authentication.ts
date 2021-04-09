import { UserModel } from "../models/user";
import ApiError from "../utils/api-error";
import ErrorProtectedRoute from "../utils/error-protected-route";
import { JWT } from "../utils/jwt";
import { Codes } from "../utils/result-codes";

export function VerifyUserToken() {
    return ErrorProtectedRoute(async (req, res, next) => {
        var token = req.headers['authorization']?.replace('Bearer ', '').trim()
        if (token) {
            var tokenResult = JWT.verify(token, {})
            let user = await UserModel.findById(tokenResult.sub).exec();
            if (user) {
                req.user = user
                next();
            } else {
                throw new ApiError('user-not-found', 404, Codes["user-not-found"])
            }
        } else {
            throw new ApiError('invalid-jwt', 401, Codes["invalid-jwt"])
        }
    })
}