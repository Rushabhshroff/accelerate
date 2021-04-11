import { HandleAppleStoreResponse } from "./apple";
import { HandlePlayStoreResponse } from "./google"

export const PurchaseResponseErrors = {
    INVALID_PAYLOAD: 6778001,
    CONNECTION_FAILED: 6778002,
    PURCHASE_EXPIRED: 6778003,
    PURCHASE_CONSUMED: 6778004,
    INTERNAL_ERROR: 6778005,
    NEED_MORE_DATA: 6778006
}

export function HandleIAPResponse(platform: 'google' | 'apple' | undefined, err: any, res: any) {
    if (platform === 'google') {
        return HandlePlayStoreResponse(err, res);
    } else if (platform === 'apple') {
        return HandleAppleStoreResponse(err, res)
    } else {
        throw {
            code: PurchaseResponseErrors.INVALID_PAYLOAD
        }
    }
}