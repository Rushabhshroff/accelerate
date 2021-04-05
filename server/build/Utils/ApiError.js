import ResponseData from "./ResponseData";
export default class ApiError extends Error {
    constructor(resultCode, responseCode = 400, message) {
        super(message);
        this.responseCode = 400;
        this.resultCode = resultCode;
        this.responseCode = responseCode;
        this.name = 'ApiError';
    }
    toResponseData() {
        return ResponseData.get(this.resultCode, undefined, undefined, this.message);
    }
}
