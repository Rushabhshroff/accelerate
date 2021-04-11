import { IAPError, IAPProduct, InAppPurchase2 as store } from '@ionic-native/in-app-purchase-2'
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
        let cache = localStorage.getItem('iap') as IAPProduct[] | null
        if (cache) {
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
            cache.filter((p) => p.id === product.id);
            cache.push(product);
        }
        localStorage.setItem('iap', JSON.stringify(cache))
    }
    static initialize() {
        console.error("Called")
        store.register(this.PRODUCTS);
        store.validator = `${Api.baseUrl}/in-app-purchase`
        store.when('products')
            .invalid((e:any) => {
                console.log(JSON.stringify(e))
            })
            .valid((prodcut: IAPProduct) => {
                console.log(prodcut);
            })
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
    product.verify()
}

function OnProductVerified(product: IAPProduct) {
    product.finish()
}

function OnProductOwned(product: IAPProduct) {
    InAppPurchase.UpdateCache(product);
}

function OnError(error: IAPError) {
    console.log(error);
}