import { Router } from 'express'
import { VerifyUserToken } from '../middlewares/authentication'
import { IUser, UserModel } from '../models/user'
import ErrorProtectedRoute from '../utils/error-protected-route'
import { ResponseData } from '../utils/response-data'
import { FitnessPartnerRoutes } from './fitness-partners'
import { UserRoutes } from './user'
export const AuthRoutes = Router()
AuthRoutes.use('/user', UserRoutes);
AuthRoutes.use('/partners', FitnessPartnerRoutes);

/** Login */
AuthRoutes.post('/', ErrorProtectedRoute(async (req, res) => {
    let { email, password } = req.body
    let token = await UserModel.authenticate(email, password);
    res.send(ResponseData.get('0000').SetData({ jwt: token }))
}))

/** Forgot Password */
AuthRoutes.post('/forgot-password', ErrorProtectedRoute(async (req, res) => {

}))

AuthRoutes.use(VerifyUserToken());

/** Refresh Token */
AuthRoutes.get('/refresh-token', ErrorProtectedRoute(async (req, res) => {
    res.send(ResponseData.get("0000").SetData({ jwt: (req.user as IUser).jwt() }));
}))