import { Admob } from '@ionic-native/admob'
import { isPlatform } from '@ionic/react';

export class ADS {
    static Init() {
        var adPublisherIds = {
            ios: {
                publisherId: "ca-app-pub-2706666117164991~8862642661",
                interstitialAdId: "ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII",
                bannerAdId: "ca-app-pub-2706666117164991/5829285218"
            },
            android: {
                publisherId: "ca-app-pub-2706666117164991~2735751427",
                interstitialAdId: "ca-app-pub-2706666117164991/4017043503",
                bannerAdId: "ca-app-pub-2706666117164991/5361191985"
            }
        };
        var admobid = isPlatform('ios') ? adPublisherIds.ios : adPublisherIds.android
        Admob.setOptions({
            ...admobid,
            autoShowBanner: true,
            autoShowInterstitial: true,
            autoShowRewarded: true,
        })
    }
    static ShowInterstitialAd() {
        return Admob.requestInterstitialAd()
    }
    static ShowBanner(){
        return Admob.createBannerView()
    }
}


