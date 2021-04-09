import { Request } from "../request";
import jwt from 'jsonwebtoken'
import { EventEmitter } from "events";
import { UserProfile } from "./user-profile";
export class Auth {
    static events = new EventEmitter()
    static init() {
        return new Promise<void>((res) => {
            let token = Auth.token
            Auth.events.on('change', (token) => {
                if (token) {
                    Auth.GetProfile().then((res) => {
                        console.log(res)
                        UserProfile.current = new UserProfile(res)
                        UserProfile.events.emit('change', UserProfile.current);
                    })
                }
            })
            Auth.events.emit('change', token)
        })
    }
    static CreateUserWithEmailAndPassword(email: string, password: string) {
        return Request<{ jwt: string }>('/auth/user', {
            method: 'PUT',
            body: JSON.stringify({ email, passwordHash: password }),
            headers: {
                "content-type": 'application/json'
            }
        }).then((data) => {
            let res: TokenResult | null = null
            if (data.data) {
                localStorage.setItem('authToken', data.data.jwt)
                res = jwt.decode(data.data?.jwt) as TokenResult
            }
            Auth.events.emit('change', res)
            return res as TokenResult
        })
    }
    static SignInWithEmailAndPassword(email: string, password: string) {
        return Request<{ jwt: string }>('/auth', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                "content-type": 'application/json'
            }
        }).then((data) => {
            let res: TokenResult | null = null
            if (data.data) {
                localStorage.setItem('authToken', data.data.jwt)
                res = jwt.decode(data.data?.jwt) as TokenResult
            }
            Auth.events.emit('change', res)
            return res as TokenResult
        })
    }
    static RefreshToken() {
        return Request<{ jwt: string }>('/auth/refresh-token').then((data) => {
            let res: TokenResult | null = null
            if (data.data) {
                localStorage.setItem('authToken', data.data.jwt)
                res = jwt.decode(data.data?.jwt) as TokenResult
            }
            Auth.events.emit('change', res)
            return res as TokenResult
        })
    }
    static UpdateProfile(details: Partial<UserInfo>) {
        return Request<UserInfo>('/auth/user', {
            method: 'POST',
            body: JSON.stringify(details),
            headers: {
                "content-type": 'application/json',
                "authorization": Auth.Bearer || ''
            }
        }).then((data) => {
            return data.data as UserInfo
        })
    }
    static GetProfile() {
        return Request<UserInfo>('/auth/user', {
            headers: {
                "authorization": Auth.Bearer || ''
            }
        }).then((data) => {
            return data.data as UserInfo
        })
    }
    static get token(): TokenResult | null {
        let token = localStorage.getItem('authToken');
        if (token) {
            return jwt.decode(token) as TokenResult
        } else {
            return null
        }
    }
    static get Bearer(): string | null {
        let token = localStorage.getItem('authToken')
        if (token) {
            return `Bearer ${token}`
        } else {
            return null
        }
    }
    static SignOut() {
        localStorage.removeItem('authToken');
        Auth.events.emit('change', null)
        UserProfile.current = null;
        UserProfile.events.emit('change', UserProfile.current)
    }
}
export interface UserInfo {
    _id: string
    name?: string,
    phoneNumber?: string,
    email: string,
    gender?: string,
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
}

export interface TokenResult {
    iat?: number,
    exp?: number,
    aud?: string | string[],
    iss?: string,
    sub: string,
    [key: string]: any
}