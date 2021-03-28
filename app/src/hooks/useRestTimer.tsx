import { useIonModal } from "@ionic/react";
import { useState } from "react";
import { Timer } from "../components/core/Timer";

export function useRestTimer() {
    const [secs, SetSecs] = useState<number | undefined>(undefined)
    const [Show, Hide] = useIonModal(() => <Timer secs={secs} onDismiss={Hide} />)
    return function (seconds?: number) {
        SetSecs(seconds)
        Show({ mode: 'ios', swipeToClose: true,cssClass:'autosized-modal' })
    }
}