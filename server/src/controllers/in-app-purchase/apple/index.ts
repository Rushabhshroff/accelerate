import { PurchaseResponseErrors } from '../purchase-error-responses'
export function HandleAppleStoreResponse(err: any, res: any) {
    if (err) {
        if (err.statusCode) {
            throw { code: PurchaseResponseErrors.CONNECTION_FAILED }
        } else {
            throw { code: AppStoreResponses[err.status] }
        }
    } else {
        if (res.expirationDate && res.expirationDate < Date.now()) {
            throw { code: PurchaseResponseErrors.PURCHASE_EXPIRED }
        } else {
            return true
        }
    }
}


const AppStoreResponses: any = {
    21000: PurchaseResponseErrors.INVALID_PAYLOAD,
    21002: PurchaseResponseErrors.INVALID_PAYLOAD,
    21003: PurchaseResponseErrors.INVALID_PAYLOAD,
    21004: PurchaseResponseErrors.INTERNAL_ERROR,
    21005: PurchaseResponseErrors.CONNECTION_FAILED,
    21006: PurchaseResponseErrors.PURCHASE_EXPIRED,
    21007: PurchaseResponseErrors.INVALID_PAYLOAD,
    21008: PurchaseResponseErrors.INVALID_PAYLOAD,
    21009: PurchaseResponseErrors.INTERNAL_ERROR,
    21010: PurchaseResponseErrors.INTERNAL_ERROR
};
