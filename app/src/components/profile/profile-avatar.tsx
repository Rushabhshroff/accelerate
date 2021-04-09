import { IonAvatar } from '@ionic/react'
import React from 'react'

interface ProfileAvatar extends Pick<React.HTMLAttributes<HTMLIonAvatarElement>, keyof React.HTMLAttributes<HTMLIonAvatarElement>> {
    size?: number,
    url?: string
}
const ProfileAvatar: React.FC<ProfileAvatar> = (props) => {
    return (
        <IonAvatar style={{ width: 70, height: 70 }}>
            <img src="" alt="User Profile" />
        </IonAvatar>
    )
}