import { Router } from 'express'
import ErrorProtectedRoute from "../utils/error-protected-route";
import { VerifyUserToken } from '../middlewares/authentication';
import iap from '../utils/iap';
import { UserModel } from '../models/user';
import { iap as keyObject } from '../config.json';
import { HandleIAPResponse, PurchaseResponseErrors } from '../controllers/in-app-purchase';
export const InAppPurchases = Router()

InAppPurchases.use(VerifyUserToken)

InAppPurchases.post('/', ErrorProtectedRoute(async (req, res) => {

    var platformMap: { [key: string]: "google" | "apple" | undefined } = {
        "android-playstore": "google",
        "ios-appstore": "apple"
    }
    var platform = platformMap[req.body.transaction?.type];
    if (!platform) {
        res.send({
            ok: false,
            code: PurchaseResponseErrors.INVALID_PAYLOAD
        })
        return;
    }
    var payment = {
        receipt: req.body.transaction.receipt,
        productId: req.body.id,
        packageName: "fitness.accelerate",
        subscription: (req.body.transaction?.type == "free subscription" || req.body.transaction?.type == "paid subscription") ? true : false,
        keyObject: platform == 'google' ? keyObject : undefined,
        secret: platform == 'apple' ? "<IOS-SECRET-HERE>" : undefined
    };

    iap.verifyPayment(platformMap[req.body.transaction.type], payment, async (error: any, response: any) => {
        try {
            let valid = HandleIAPResponse(platform, error, response)
            if (valid) {
                if (!req.user.inAppPurchases.find((x: any) => x.transactionId == response.transactionId)) {
                    req.user.inAppPurchases.push(req.body.receipt)
                    await UserModel.updateOne(req.user)
                }
                res.send({
                    ok: true,
                    data: {
                        transaction: req.body.transaction
                    }
                })
            }
        } catch (err) {
            if (err.code) {
                res.send({
                    ok: false,
                    data: err
                })
            } else {
                res.send({
                    ok: false,
                    data: PurchaseResponseErrors.INTERNAL_ERROR
                })
            }
        }
    });
}))

