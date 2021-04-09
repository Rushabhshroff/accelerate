import { Api } from ".."

export interface ResponseData<T> {
    responseCode: number
    resultCode: string
    message?: string
    data?: T
    error?: string
}

export function Request<T = unknown>(url: string, init?: RequestInit) {
    let input = Api.baseUrl + url
    return fetch(input, init).then(async (res) => {
        let data = await res.json()
        if (res.ok) {
            return new ResponseData<T>({ ...data, responseCode: res.status })
        } else {
            throw new ResponseData({ ...data, responseCode: res.status })
        }
    })
}

export class ResponseData<T>{
    constructor(ob?: ResponseData<T>) {
        Object.assign(this, ob)
    }
}