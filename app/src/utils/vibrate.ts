import { isPlatform } from "@ionic/react";

export function Vibrate(ms: number = 200) {
    if (isPlatform('android')) {
        window.navigator.vibrate(ms);
    }
}