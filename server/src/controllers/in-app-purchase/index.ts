import { HandleAppleStoreResponse } from "./apple";
import { HandlePlayStoreResponse } from "./google"
import { PurchaseResponseErrors } from "./purchase-error-responses";



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

export * from './purchase-error-responses'