import { Codes } from "./ResultCodes";
export default class ResponseData {
    constructor(response) {
        this.data = undefined;
        this.error = undefined;
        this.resultCode = response.resultCode;
        this.message = response.message;
        this.data = response.data;
        this.error = response.error;
    }
    static get(code, message = "", data = undefined, error = undefined) {
        if (message == undefined)
            return new ResponseData({ resultCode: code, message: Codes[code], data: data, error: error });
        else
            return new ResponseData({ resultCode: code, message: message, data: data, error: error });
    }
    parseAs() {
        return this.data ? this.data : undefined;
    }
}
