import { IonContent, IonHeader, IonIcon, IonItem, IonMenu } from '@ionic/react'
import React from 'react'
import ProfileItem from './ProfileItem'
import { barbellOutline, settings } from 'ionicons/icons'
interface DrawerProps {

}

class Drawer extends React.PureComponent<DrawerProps>{
    static ref: HTMLIonMenuElement | null = null
    close() {
        Drawer.ref?.setOpen(false, true);
    }
    render() {
        return (
            <IonMenu ref={ref => Drawer.ref = ref} side='start' contentId='drawer-content' menuId='drawer'>
                <IonHeader className='ion-no-border'>
                    <ProfileItem />
                </IonHeader>
                <IonContent id='drawer-content'>
                    <IonItem routerLink='/exercise-list' onClick={() => this.close()} button lines='none'>
                        Exercises
                    <IonIcon slot='start' icon={barbellOutline} />
                    </IonItem>
                    <IonItem routerLink='/settings' onClick={() => this.close()} button lines='none'>
                        Settings
                    <IonIcon slot='start' icon={settings} />
                    </IonItem>
                </IonContent>
            </IonMenu>
        )
    }
}
export default Drawer