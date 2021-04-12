import { PurchaseResponseErrors } from "../purchase-error-responses";

export function HandlePlayStoreResponse(err: any, res: any) {
    if (err) {
        if (err.statusCode) {
            throw { code: PurchaseResponseErrors.INVALID_PAYLOAD }
        } else {
            throw { code: PurchaseResponseErrors.INTERNAL_ERROR }
        }
    } else {
        if (res.expirationDate && res.expirationDate < Date.now()) {
            throw { code: PurchaseResponseErrors.PURCHASE_EXPIRED }
        } else {
            return true
        }
    }
}