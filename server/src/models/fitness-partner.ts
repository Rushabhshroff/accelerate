import { Document, Schema, model } from 'mongoose';

export interface IFitnessPartner extends Document {
    name: string,
    phoneNumber: string,
    email: string,
    gender?: string,
    passwordHash: string,
    passwordSalt: string,
    address: {
        line1: string,
        line2: string,
        pincode: string
        city: string,
        state: string,
        country: string,
        point: {
            type: string,
            coordinates: number[]
        }
    },
    photoUrl: string,
    verified: boolean,
    documents: {
        title: string,
        proof: string   //could be image url, identification number, etc.
    }[]
}

export const FitnessPartnerSchema = new Schema<IFitnessPartner>({
    name: { type: String, required: [true, "Name is required"] },
    phoneNumber: { type: String, required: [true, "Phone number is required"], unique: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: [true, "email is required"], unique: true },
    passwordHash: { type: String, required: [true, "Password is required"] },
    passwordSalt: { type: String, required: true },
    address: {
        type:
        {
            line1: { type: String, required: [true, "Address Line1 is required"] },
            line2: { type: String, required: false },
            postalCode: { type: String, required: [true, "Postal Code is required"] },
            point: {
                type: { type: String, required: true },
                coordinates: { type: [Number], required: true }
            },
        },
        required: [true, "Address is required."]
    },
    photoUrl: { type: String, required: [true, "Profile picture is required for identification"] },
    verified: { type: Boolean, required: true },
    documents: [{
        title: { type: String, required: true },
        proof: { type: String, required: true },
    }]
}, {
    toJSON: {
        transform: (doc, ret, options) => {
            delete ret.passwordHash;
            delete ret.passwordSalt
            return ret;
        }
    }
});

export const FitnessPartnerModel = model("fitnessPartner", FitnessPartnerSchema)