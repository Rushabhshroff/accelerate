import { Document, Schema, model, Model } from 'mongoose';
import ApiError from '../utils/api-error';
import { JWT } from '../utils/jwt';
import { Codes } from '../utils/result-codes';
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    name?: string,
    phoneNumber?: string,
    email: string,
    gender?: string,
    passwordHash: string,
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
    photoUrl?: string,
    jwt(): string

}
export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): string
}
export const UserSchema = new Schema<IUser>({
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String, unique: true, sparse: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: [true, "email is required"], unique: true, sparse: true },
    passwordHash: { type: String, required: [true, "Password is required"] },
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
}, {
    toJSON: {
        transform: (doc, ret, options) => {
            delete ret.passwordHash;
            delete ret.passwordSalt
            return ret;
        }
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    const SALT_WORK_FACTOR = 10;

    if (!user.isModified('passwordHash')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err: any, salt: any) {
        if (err) {
            console.log(err)
            return next(err);
        }

        bcrypt.hash(user.passwordHash, salt, function (err: any, hash: any) {
            if (err) return next(err);

            user.passwordHash = hash;
            user.passwordSalt = salt;
            next();
        })
    })
})
UserSchema.method('jwt', function () {
    return JWT.sign({
        _couchdb: {
            roles: ['user']
        }
    }, {
        subject: String(this._id),
        keyid: 'accelerate',
        expiresIn: '7d',
        issuer: 'accelerate.fitness',
    })
})

UserSchema.static('authenticate', async function (email: string, password: string) {
    let user = await UserModel.findOne({ email }).exec()
    if (user) {
        if (bcrypt.compareSync(password, user.passwordHash)) {
            return user.jwt()
        } else {
            throw new ApiError('', 401, Codes['invalid-creds'])
        }
    } else {
        throw new ApiError('user-not-found', 404, Codes['user-not-found'])
    }
})
export const UserModel = model<IUser, IUserModel>('user', UserSchema);