import { Document, Schema } from 'mongoose';

export interface FitnessPartnersSchema extends Document{
    name: string,
    phoneNumber: string,
    email: string,
    passwordHashed: string,
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
    profilePicUrl: string,
    verified: boolean,
    documents: {
        title: string,
        proof: string   //could be image url, identification number, etc.
    }[]
}

export const FitnessPartnersSchema = new Schema<FitnessPartnersSchema>({
    name: {type: String, required: [true, "Name is required"]},
    phoneNumber: {type: String, required: [true, "Phone number is required"]},
    email: {type: String, required: [true, "email is required"]},
    passwordHashed: {type: String, required: [true, "Password is required"]},
    passwordSalt: {type: String, required: true},
    address: {
        type:
        {
            line1: {type: String, required: [true, "Line1 is required"]},
            line2: {type: String, required: [true, "Line2 is required"]},
            pincode: {type: String, required: [true, "Pincode is required"]},
            point: {
                type: {type: String, required: true},                
                coordinates: { type: [Number], required: true}
            },        
           
        }
    },
    profilePicUrl: {type: String, required: [true, "Profile picture is required for identification"},
    verified: {type: Boolean, required: true},
    documents: [{
        type:{
            title: {type: String, required: true},
            proof: {type: String, required: true},
        }
    }]
});