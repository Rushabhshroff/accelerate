import express, { Router } from 'express'
import ErrorProtectedRoute from "../utils/error-protected-route";
import { ResponseData } from "../utils/response-data";
import { IUser, UserModel } from "../models/user";
import ApiError from '../utils/api-error';
import { RequestFilter } from '../middlewares';
import { VerifyUserToken } from '../middlewares/authentication';
import validator from 'validator'
import { ImageBucket, S3 } from '../utils/s3';
export const UserRoutes = Router()

/** Registration */
UserRoutes.put('/', RequestFilter(['_id']), ErrorProtectedRoute(async (req, res) => {
    try {
        let user = await UserModel.create(req.body)
        res.send(ResponseData.get("0000").SetData({ jwt: user.jwt() }));
    } catch (err) {
        console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            throw new ApiError("0011", 400, "User already exists")
        } else {
            throw err
        }
    }
}))

UserRoutes.use(VerifyUserToken());

/** Get Profile */
UserRoutes.get('/', ErrorProtectedRoute(async (req, res) => {
    res.send(ResponseData.get('0000').SetData((req.user as IUser).toJSON()))
}))

/** Update Profile */
UserRoutes.post('/', RequestFilter(['_id', 'passwordHash', 'passwordSalt']), ErrorProtectedRoute(async (req, res) => {
    let updateData = req.body
    let user = (req.user as IUser)
    if (updateData.photoUrl) {
        if (!validator.isURL(updateData.photoUrl)) {
            let base64Data = String(updateData.photoUrl);
            let match = base64Data.match(/[^:/]\w+(?=;|,)/)
            let ext = match ? match[0] : ''
            let location = `profile-images/${user._id}${ext ? '.' + ext : ''}`
            try {
                let res = await S3().putObject({
                    Bucket: ImageBucket,
                    Key: location,
                    Body: Buffer.from(base64Data,'base64'),
                    GrantReadACP:'public',
                }).send((err) => {
                    console.log(err)
                })
                updateData.photoUrl = `https://${ImageBucket}.s3.amazonaws.com/${location}`
            } catch {
                throw new ApiError('image-upload-failed', 500, 'Failed to upload image please try again later.')
            }
        }
    }
    Object.assign(user,updateData);
    await user.save();
    res.send(ResponseData.get('0000').SetData((user).toJSON()))
}))
