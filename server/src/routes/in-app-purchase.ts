import { Router } from 'express'
import ErrorProtectedRoute from "../utils/error-protected-route";
import { ResponseData } from "../utils/response-data";
import ApiError from '../utils/api-error';
import { VerifyUserToken } from '../middlewares/authentication';
import { Codes } from '../utils/result-codes';
//@ts-ignore
import iap from 'iap';
import { UserModel } from '../models/user';
import { JWT } from '../utils/jwt';

export const InAppPurchases = Router()

InAppPurchases.use(VerifyUserToken)

InAppPurchases.post('/', ErrorProtectedRoute(async (req, res, next) => {

    var platformMap = new Map([["android-playstore", 'google'], ["ios-appstore", "apple"]])    

    if (platformMap.get(req.body.transaction.type) !== 'google')
    {
        throw new ApiError("invalid-platform", 400, Codes["invalid-platform"]);
    }
    else {

        var payment = {
            receipt: req.body.transaction.receipt,
            productId: req.body.id,
            packageName: "fitness.accelerate",
            subscription: (req.body.transaction.type == "free subscription" || req.body.transaction.type == "paid subscription")?true:false,
            keyObject: ""
        };
        
        iap.verifyPayment(platformMap.get(req.body.transaction.type), payment, async (error: any, response: any) => {
            if(error){
                throw new ApiError("iap-verification-failed", 400, Codes["iap-verification-failed"])
            }
            else{
                let resp = {
                    ok : true,
                    data : {
                        transaction : req.body.transaction
                    }
                }
                
                if(!req.user.inAppPurchases.find((x: any) => x.transactionId == response.transactionId)){                    
                    req.user.inAppPurchases.push(req.body.receipt)
                    await UserModel.updateOne(req.user)
                    res.send(ResponseData.get("0000").SetData(resp))
                }
            }
        });
    }
}))