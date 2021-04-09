import jwt from 'jsonwebtoken'
import { rsa_private, rsa_public } from '../config.json'

export class JWT {
    static sign(payload: any, options: jwt.SignOptions) {
        options.algorithm = 'RS256'
        return jwt.sign(payload, rsa_private, options)
    }
    static decode<T = unknown>(token: string, options: jwt.DecodeOptions) {
        return jwt.decode(token, options) as T & TokenResult;
    }
    static verify<T = unknown>(token: string, options: jwt.VerifyOptions) {
        options.algorithms = ['RS256']
        //@ts-ignore
        return jwt.verify(token, rsa_public, options) as T & TokenResult;
    }
}

export interface TokenResult {
    iat?: number,
    exp?: number,
    aud?: string | string[],
    iss?: string,
    sub: string,
    [key: string]: any
}

