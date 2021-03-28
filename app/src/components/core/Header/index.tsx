import { IonHeader, IonToolbar } from "@ionic/react";
import React from "react";

export interface Header extends Pick<React.HTMLAttributes<HTMLIonHeaderElement>, keyof React.HTMLAttributes<HTMLIonHeaderElement>> {

}
export const Header: React.FC<Header> = (props) => {
    return (
        <IonHeader mode='md' {...props} className={['ion-no-border',props.className].join(' ')}>
            <IonToolbar>
                {props.children}
            </IonToolbar>
        </IonHeader>
    )
}