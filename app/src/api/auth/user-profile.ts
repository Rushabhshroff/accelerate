import EventEmitter from "events";
import { Auth, UserInfo } from ".";

export class UserProfile implements UserInfo {
    _id!: string;
    firstName?: string;
    lastName?: string;
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
    public get name() {
        let name = [this.firstName, this.lastName].filter(s => s !== undefined).join(" ");
        return name.trim() || this.email.split('@')[0]
    }
    constructor(info: UserInfo) {
        Object.assign(this, info)
    }
    static current: UserProfile | null
    static events: EventEmitter = new EventEmitter()
    update(info: Partial<UserInfo>) {
        return Auth.UpdateProfile(info).then((res) => {
            Object.assign(UserProfile.current, res)
            UserProfile.events.emit('change', UserProfile.current);
        })
    }
}