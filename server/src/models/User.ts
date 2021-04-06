import { Document, Schema, model } from 'mongoose';
const bcrypt = require('bcrypt')

export interface UserIntf extends Document{
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

export const UserSchema = new Schema<UserIntf>({
    name: {type: String},
    phoneNumber: {type: String},
    gender: {type: String, enum: ["Male", "Female", "Other"]},
    email: {type: String, required: [true, "email is required"]},
    passwordHashed: {type: String, required: [true, "Password is required"]},
    passwordSalt: {type: String},
    address: {
        type:
        {
            line1: {type: String, required: [true, "Line1 is required"]},
            line2: {type: String},
            pincode: {type: String, required: [true, "Pincode is required"]},
            city: {type: String, required: [true, "City is required"]},
            state: {type: String, required: [true, "State is required"]},
            country: {type: String, required: [true, "Country is required"]},
            point: {
                type:{
                    title: {type: String, required: true},                
                    coordinates: { type: [Number], required: true}
                }
            },
        }, required: false
    },
    profilePicUrl: {type: String},
});

UserSchema.pre('save', function(next){
    var user = this;
    const SALT_WORK_FACTOR = 10;    

    if (!user.isModified('passwordHashed')) return next();
    
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err: any, salt: any) {        
        if (err) 
        {
            console.log(err)
            return next(err);
        }
        
        bcrypt.hash(user.passwordHashed, salt, function(err: any, hash: any) {
            if (err) return next(err);

            user.passwordHashed = hash;
            user.passwordSalt = salt;
            next();
        })
    })
})

export const UserModel = model('user', UserSchema);