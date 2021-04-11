import { IonBackButton, IonButtons, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react'
import React, { CSSProperties } from 'react'
import BackButton from './BackButton'

interface HeaderProps {
    title?: string,
    noborder?: boolean,
    backButton?: boolean,
    backIcon?: any,
    onBack?:(e:any)=>void,
    titleStyle?:CSSProperties,
    backRoute?:string
}

const Header: React.FC<HeaderProps> = (props) => {
    const classes: string[] = []
    if (props.noborder) {
        classes.push('ion-no-border')
    }
    return (
        <IonHeader className={classes.join(' ')}>
            <IonToolbar>
                <IonButtons slot='start'>
                    {props.backButton ? <BackButton OnClick={props.onBack} icon={props.backIcon} /> : <IonMenuButton />}
                </IonButtons>
                <IonTitle style={props.titleStyle}>{props.title}</IonTitle>
                {props.children}
            </IonToolbar>

        </IonHeader>
    )
}

export default Header