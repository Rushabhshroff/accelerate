import { IAPError, IAPProduct, InAppPurchase2 as store } from '@ionic-native/in-app-purchase-2'
import { isPlatform } from '@ionic/react';
import { Api } from '../api';
export class InAppPurchase {
    private static ready = false;
    private static PRODUCTS = [
        {
            id: "fitness.accelerate.plus.monthly",
            type: store.PAID_SUBSCRIPTION
        },
        {
            id: "fitness.accelerate.plus.yearly",
            type: store.PAID_SUBSCRIPTION
        }
    ]
    static get Cache() {
        let data = localStorage.getItem('iap') as string | null 
        if (data) {
            let cache = JSON.parse(data) as IAPProduct[];
            let l = cache.length
            cache = cache.filter((f) => new Date(f.expiryDate || 0).getTime() > Date.now())
            if (cache.length !== l) {
                localStorage.setItem('iap', JSON.stringify(cache))
            }
            return cache;
        } else {
            return null
        }
    }
    static UpdateCache(product: IAPProduct) {
        let cache = InAppPurchase.Cache
        if (!cache) {
            cache = []
        }
        if (!cache.some(p => p.id === product.id)) {
            cache.push(product)
        } else {
            cache = cache.filter((p) => p.id === product.id);
            cache.push(product);
        }
        localStorage.setItem('iap', JSON.stringify(cache))
    }
    static initialize() {
        if (!isPlatform('capacitor')) {
            return;
        }
        store.verbosity = store.ERROR
        store.register(this.PRODUCTS);
        const url = `${Api.baseUrl}/in-app-purchase`
        store.validator = url
        store.when('product')
            .approved(OnProductApproved)
            .verified(OnProductVerified)
            .owned(OnProductOwned)
            .error(OnError)
        store.refresh()
        store.ready(() => {
            InAppPurchase.ready = true;
        })
    }
    static Purchase(product: IAPProduct) {
        if (InAppPurchase.ready) {
            store.order(product);
        }
    }
}

function OnProductApproved(product: IAPProduct) {
    /*product.verify().error((err: any) => {
        console.info(JSON.stringify(err))
    })*/
    product.finish()
}

function OnProductVerified(product: IAPProduct) {
    product.finish()
}

function OnProductOwned(product: IAPProduct) {
    InAppPurchase.UpdateCache(product);
}

function OnError(error: IAPError) {
    console.log(error.code + " " + error.message);
}