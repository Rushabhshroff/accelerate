import { IonAvatar } from '@ionic/react'
import React from 'react'

export interface ProfileAvatar extends Pick<React.HTMLAttributes<HTMLIonAvatarElement>, keyof React.HTMLAttributes<HTMLIonAvatarElement>> {
    size?: number,
    url?: string
}
export const ProfileAvatar: React.FC<ProfileAvatar> = (props) => {
    return (
        <IonAvatar style={{ width: props.size || 70, height: props.size || 70 }} {...props}>
            <img src={props.url || '/assets/placeholder/profile.png'} alt="User Profile" />
        </IonAvatar>
    )
}