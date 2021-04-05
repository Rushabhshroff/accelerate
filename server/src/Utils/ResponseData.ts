import { Codes } from "./ResultCodes";

interface ResponseDataIntf {
    resultCode: string
    message?: string
    data?: any
    error?: string
}

export default class ResponseData {
    resultCode: string
    message?: string
    data?: any = undefined
    error?: any = undefined
    
    constructor(response: ResponseDataIntf) {
        this.resultCode = response.resultCode;
        this.message = response.message;
        this.data = response.data;
        this.error = response.error
    }

    static get(code: string, message: string = "", data: any = undefined, error: any = undefined) {
        if (message == undefined)
            return new ResponseData({ resultCode: code, message: Codes[code], data: data, error: error})
        else
            return new ResponseData({ resultCode: code, message: message, data: data, error: error})
    }

    

    parseAs<T>() {
        return this.data ? this.data as T : undefined
    }
}