import EventEmitter from "events";
import { Auth, UserInfo } from ".";

export class UserProfile implements UserInfo {
    _id!: string;
    name?: string;
    phoneNumber?: string;
    email!: string;
    gender?: string;
    address?: {
        line1: string;
        line2?: string;
        pincode: string;
        city: string;
        state: string;
        country: string;
        point: {
            type: string;
            coordinates: number[];
        };
    };
    photoUrl?: string;
    constructor(info: UserInfo) {
        Object.assign(this, info)
    }
    static current: UserProfile | null
    static events: EventEmitter = new EventEmitter()
    update(info: Partial<UserInfo>) {
        Auth.UpdateProfile(info).then((res) => {
            Object.assign(this, res)
            UserProfile.events.emit('change', UserProfile.current);
        })
    }
}