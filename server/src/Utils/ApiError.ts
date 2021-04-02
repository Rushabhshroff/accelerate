import { ResponseData } from "./ResponseData"

export default class ApiError extends Error {
    resultCode: string
    responseCode: number = 400
    constructor(resultCode: string, responseCode: number = 400, message?: string) {
        super(message)
        this.resultCode = resultCode
        this.responseCode = responseCode
        this.name = 'ApiError'
    }
    toResponseData() {
        return ResponseData.get(this.resultCode, undefined);
    }
}