import { IonButton, IonIcon, IonItem, IonPopover } from '@ionic/react'
import { ellipsisVertical } from 'ionicons/icons';
import React, { useState } from 'react'

interface PopoverButtonProps {
    icon?: any,
    iconProps?: any,
    buttonProps?: any
}
//@ts-ignore
const PopoverContext = React.createContext<{
    popoverState: { showPopover: boolean, event: undefined },
    setShowPopover: (params: { showPopover: boolean, event: undefined }) => void
}>()
export const PopoverButton: React.FC<PopoverButtonProps> = (props) => {
    const [popoverState, setShowPopover] = useState({ showPopover: false, event: undefined });
    return (
        <PopoverContext.Provider value={{ popoverState, setShowPopover }}>
            <IonPopover
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
            >
                {props.children}
            </IonPopover>
            <IonButton {...props.buttonProps} onClick={
                (e: any) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e })
                }}>
                <IonIcon {...props.iconProps} icon={props.icon || ellipsisVertical} />
            </IonButton>
        </PopoverContext.Provider>
    )
}



export const PopoverItem: React.FC<any> = (props) => {
    const { popoverState, setShowPopover } = React.useContext(PopoverContext)
    const onClick = () => {
        setShowPopover({ showPopover: false, event: undefined })
        if (props.onClick) {
            props.onClick()
        }
    }
    return (
        <IonItem  {...props} onClick={onClick} lines='none' >
            {props.children}
        </IonItem>
    )
}