import { Codes } from "./ResultCodes";

  var ResponseData = /** @class */ (function () {
    function ResponseData(options) {
        this.resultCode = options.resultCode;
        this.message = options.message;
        this.data = options.data;
        this.error = options.error;
    }
    ResponseData.code = function (code) {
        return new ResponseData({ resultCode: code, message: Codes[code] });
    };
    ResponseData.prototype.setMessage = function (message) {
        this.message = message;
        return this;
    };
    ResponseData.prototype.setData = function (data) {
        this.data = data;
        return this;
    };
    ResponseData.prototype.setError = function (error) {
        this.error = error;
        return this;
    };
    ResponseData.prototype.parseAs = function () {
        return this.data ? this.data : undefined;
    };
    ResponseData.fromError = function (err) {
        return new ResponseData({ resultCode: "unknown" }).setError(err.message);
    };
    return ResponseData;
}());
export default ResponseData;