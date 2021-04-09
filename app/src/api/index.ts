import { Auth } from './auth'

export * from './auth'
export * from './request'

export class Api {
    static baseUrl = ''
    static init(baseUrl?: string) {
        Api.baseUrl = baseUrl || ''
        return Auth.init()
    }
}