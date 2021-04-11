import React, { useEffect, useState } from 'react'
import { InAppPurchase2 as store, IAPProduct, IAPError } from '@ionic-native/in-app-purchase-2'
import { InAppPurchase } from '../utils/in-app-purchase'
import { isPlatform, useIonAlert } from '@ionic/react'

export function useInAppPurchase() {
    const cache = InAppPurchase.Cache
    const [Owned, SetOwned] = useState(store.products?.filter(f => f.owned) || null)
    const [Alert] = useIonAlert()
    useEffect(() => {
        if (isPlatform('capacitor')) {
            const OnUpdate = (product: IAPProduct) => {
                SetOwned(store.products.filter(f => f.owned))
            }
            const OnError = (err: IAPError) => {
                Alert({
                    header: "IAP Error!",
                    message: err.message,
                    buttons: [{ text: "Okay" }]
                })
            }
            store.when('product')
                .updated(OnUpdate)
                .error(OnError);
            return () => {
                store.off(OnUpdate);
                store.off(OnError)
            }
        }
    })
    const monthlyPlus = isPlatform('capacitor') ? store.get("fitness.accelerate.plus.monthly") || cache?.find((p) => p.id === "fitness.accelerate.plus.monthly") || null : null;
    const yearlyPlus = isPlatform('capacitor') ? store.get("fitness.accelerate.plus.yearly") || cache?.find((p) => p.id === "fitness.accelerate.plus.yearly") || null : null;
    return {
        fitnessPlus: monthlyPlus?.owned || yearlyPlus?.owned || false,
        purchasedProducts: Owned || cache || [],
        allProducts: store.products,
        monthlyPlus,
        yearlyPlus
    }
}