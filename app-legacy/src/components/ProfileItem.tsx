import { IonAvatar, IonItem, IonText } from '@ionic/react'
import React from 'react'
import './ProfileItem.scss'
interface ProfileItemProps {

}
const ProfileItem: React.FC<ProfileItemProps> = (props) => {
    return (
        <div className='profile-item-container'>
            <div className='profile-item'>
                <IonAvatar>
                    <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" alt=""/>
                </IonAvatar>
                <IonText className='edit'>edit</IonText>
                <IonText className='name'>Rushabh Shroff</IonText>
                <IonText className='email'>rshroff98@gmail.com</IonText>
            </div>
        </div>
    )
}

export default ProfileItem