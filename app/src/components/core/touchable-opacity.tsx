import { IonRouterLink } from '@ionic/react'
import React, { useEffect, useState } from 'react'

export const TouchableOpcity: React.FC<Pick<React.HTMLAttributes<HTMLIonRouterLinkElement>, keyof React.HTMLAttributes<HTMLIonRouterLinkElement>> & { activeOpacity?: number }> = (props) => {
    const [touched, SetTouched] = useState(false)
    const toggleTouched = () => {
        SetTouched(!touched)
    }

    const handleMouseUp = () => {
        // Handle smooth animation when clicking without holding
       
            setTimeout(() => {
                SetTouched(false)
            }, 50);
    }
    return (
        <IonRouterLink
            {...props}
            onMouseDown={toggleTouched}
            onMouseUp={handleMouseUp}
            style={{
                opacity: touched ? props.activeOpacity || 0.5 : 1,
                ...props.style
            }}
            className={['touchable', props.className].join(' ')}>
            {props.children}
        </IonRouterLink>
    )
}