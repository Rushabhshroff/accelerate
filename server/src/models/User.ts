import { Document, Schema, model } from 'mongoose';
const bcrypt = require('bcrypt')

export interface IUser extends Document {
    name?: string,
    phoneNumber?: string,
    email: string,
    gender?: string,
    passwordHashed: string,
    passwordSalt: string,
    address?: {
        line1: string,
        line2?: string,
        pincode: string,
        city: string,
        state: string,
        country: string,
        point: {
            type: string,
            coordinates: number[]
        }
    },
    profilePicUrl?: string
}

export const UserSchema = new Schema<IUser>({
    name: { type: String },
    phoneNumber: { type: String, unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: [true, "email is required"], unique: true },
    passwordHashed: { type: String, required: [true, "Password is required"] },
    passwordSalt: { type: String },
    address: {
        type:
        {
            line1: { type: String, required: [true, "Address Line1 is required"] },
            line2: { type: String },
            postalCode: { type: String, required: [true, "Postal is required"] },
            city: { type: String, required: [true, "City is required"] },
            state: { type: String, required: [true, "State is required"] },
            country: { type: String, required: [true, "Country is required"] },
            point: {
                type: {
                    title: { type: String, required: true },
                    coordinates: { type: [Number], required: true }
                }
            },
        },
    },
    photoUrl: { type: String },
});

UserSchema.pre('save', function (next) {
    var user = this;
    const SALT_WORK_FACTOR = 10;

    if (!user.isModified('passwordHashed')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err: any, salt: any) {
        if (err) {
            console.log(err)
            return next(err);
        }

        bcrypt.hash(user.passwordHashed, salt, function (err: any, hash: any) {
            if (err) return next(err);

            user.passwordHashed = hash;
            user.passwordSalt = salt;
            next();
        })
    })
})

export const UserModel = model('user', UserSchema);