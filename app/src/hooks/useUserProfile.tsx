import { useEffect, useState } from "react";
import { UserProfile } from "../api/auth/user-profile";

export function useUserProfile() {
    const [profile, SetProfile] = useState(UserProfile.current);

    useEffect(() => {
        const OnChange = (profile: any) => {
            console.log(profile)
            SetProfile(profile);
        }
        UserProfile.events.on('change', OnChange)
        return () => {
            UserProfile.events.off('change', OnChange)
        }
    }, [])
    return profile;
}