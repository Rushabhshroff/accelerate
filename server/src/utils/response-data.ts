import { Codes } from "./result-codes";

export interface IResponseData {
    resultCode: string
    message?: string
    data?: any
    error?: string
}

export class ResponseData {
    resultCode: string
    message?: string
    data?: any = undefined
    error?: string = undefined

    constructor(response: IResponseData) {
        this.resultCode = response.resultCode;
        this.message = response.message;
        this.data = response.data;
        this.error = response.error
    }

    static get(code: string, message: string = "", data: any = undefined, error: any = undefined) {
        if (message.length == 0)
            return new ResponseData({ resultCode: code, message: Codes[code], data: data, error: error })
        else
            return new ResponseData({ resultCode: code, message: message, data: data, error: error })
    }

    SetData(data: any) {
        this.data = data;
        return this;
    }

    SetMessage(message: string) {
        this.message = message;
        return this;
    }

    SetResultCode(resultCode: string) {
        this.resultCode = resultCode
        return this;
    }

    SetError(error: string) {
        this.error = error;
        return this;
    }

    parseAs<T>() {
        return this.data ? this.data as T : undefined
    }
}