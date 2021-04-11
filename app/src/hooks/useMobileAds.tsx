import { ADS } from "../utils/ads";
import { useInAppPurchase } from "./useInAppPurchase";

export function useMobileAds() {
    const { fitnessPlus } = useInAppPurchase();

    return {
        ShowInterstitial: () => {
            if (!fitnessPlus) {
                ADS.ShowInterstitialAd()
            }
        },
        ShowBanner: () => {
            if (!fitnessPlus) {
                ADS.ShowBanner()
            }
        }
    }
}