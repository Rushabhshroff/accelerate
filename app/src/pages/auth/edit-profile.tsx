import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonPage, IonRippleEffect, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, useIonAlert, useIonLoading, useIonToast } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import validator from 'validator'
import { UserInfo } from '../../api'
import { Header } from '../../components/core'
import { ProfileAvatar } from '../../components/profile/profile-avatar'
import { useUserProfile } from '../../hooks/useUserProfile'
import './styles.scss'
export interface EditProfilePage {

}
export const EditProfilePage: React.FC<EditProfilePage> = (props) => {
    const profile = useUserProfile()
    const form = useRef<HTMLFormElement | null>(null)
    const [profileImage, SetProfileImage] = useState<string | undefined>(profile?.photoUrl);
    const [Alert] = useIonAlert()
    const [ShowLoader, HideLoader] = useIonLoading()
    const [Toast, Hide] = useIonToast()
    const UpdateProfile = async () => {
        if (form.current) {
            let data = new FormData(form.current);
            let UpdateProfile: Partial<UserInfo> & { [key: string]: any } = {}
            data.forEach((v, k) => {
                if (v !== "") {
                    UpdateProfile[k] = v
                }
            })
            if (profileImage !== profile?.photoUrl) {
                UpdateProfile.photoUrl = profileImage
            }
            if (!UpdateProfile.email || !validator.isEmail(UpdateProfile.email)) {
                Alert({ message: "Invalid Email Address", buttons: [{ text: "Okay" }] })
                return;
            }
            if (UpdateProfile.phoneNumber && !validator.isMobilePhone(UpdateProfile.phoneNumber)) {
                Alert({ message: "Invalid Phone Number", buttons: [{ text: "Okay" }] })
                return;
            }
            try {
                await profile?.update(UpdateProfile)
                Toast("Profile Upadted", 1000)
            } catch (err) {
                console.log(err)
                Toast({
                    message: err.error || err.message,
                    duration: 1000
                })
            }
        }
    }
    return (
        <IonPage>
            <Header>
                <IonButtons slot='start'>
                    <IonBackButton />
                </IonButtons>
                <IonTitle>Edit Profile</IonTitle>
            </Header>
            <IonContent>
                <section className='all-center'>
                    <ProfileAvatar size={100} />
                    <div className='upload-button'>
                        {/*<input accept=".png,.jpg,.jpeg" onChange={(e) => {
                            let files = e.currentTarget.files
                            let image = files && files.length > 0 ? files[0] : undefined
                            if (image) {
                                var FR = new FileReader();
                                FR.addEventListener('load', (e) => {
                                    SetProfileImage(e.target?.result as string)
                                })
                                FR.readAsDataURL(image)
                            }
                        }} type='file' />
                        <div className='ion-activatable ripple-parent my-2'>
                            <IonText color='primary'>Change Picture</IonText>
                            <IonRippleEffect></IonRippleEffect>
                    </div>*/}
                    </div>
                </section>
                <section>
                    <form ref={form} onSubmit={e => e.preventDefault()}>
                        <IonItemGroup>
                            <IonItem lines='none'>Basic Details</IonItem>
                            <IonRow>
                                <IonCol size='6'>
                                    <IonItem >
                                        <IonLabel position='floating'>First Name</IonLabel>
                                        <IonInput value={profile?.firstName} name='firstName' />
                                    </IonItem>
                                </IonCol>
                                <IonCol size='6'>
                                    <IonItem >
                                        <IonLabel position='floating'>Last Name</IonLabel>
                                        <IonInput value={profile?.lastName} name='lastName' />
                                    </IonItem>
                                </IonCol>
                                <IonCol size='12'>
                                    <IonItem >
                                        <IonLabel position='floating'>Gender</IonLabel>
                                        <IonSelect value={profile?.gender} name='gender' style={{ width: '100%' }}>
                                            <IonSelectOption>Male</IonSelectOption>
                                            <IonSelectOption>Female</IonSelectOption>
                                            <IonSelectOption>Other</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                </IonCol>
                                <IonCol size='12'>
                                    <IonItem >
                                        <IonLabel position='floating'>Email Address</IonLabel>
                                        <IonInput value={profile?.email} name='email' type='email' />
                                    </IonItem>
                                </IonCol>
                                <IonCol size='12'>
                                    <IonItem >
                                        <IonLabel position='floating'>Phone Number</IonLabel>
                                        <IonInput value={profile?.phoneNumber} name='phoneNumber' type='tel' />
                                    </IonItem>
                                </IonCol>
                                <IonCol size='12'>
                                    <IonButton onClick={UpdateProfile} expand='full'>Update</IonButton>
                                </IonCol>
                            </IonRow>
                        </IonItemGroup>
                    </form>
                </section>
            </IonContent>
        </IonPage>
    )
}