import { IonButton, IonCheckbox, IonContent, IonItem, IonItemDivider, IonLabel, IonPage, IonSelect, IonSelectOption, IonText } from '@ionic/react'
import React from 'react'
import Header from '../../components/Header'
import { Sounds } from '../../utils/Sound'
import useSettings from './hook'
import './Settings.scss'
import { version, buildNumber } from '../../../package.json'
interface SettingsProps {

}
const SettingsPage: React.FC<SettingsProps> = (props) => {
    return (
        <IonPage className='settings'>
            <Header backButton title='settings' noborder>

            </Header>
            <IonContent>
                <UnitsLocalization />
                <GeneralSettings />
                <RestTimerSettings />
                <OtherServices />
                <ContactSupport />
                <Legal />
                <div className='centering-box'>
                    {/*<IonButton style={{ width: '80%' }} expand='full'>
                        <IonLabel>Log Out</IonLabel>
    </IonButton>*/}
                    <div className='version light-text'>{version} ({buildNumber})</div>
                </div>
            </IonContent>
        </IonPage>
    )
}

function UnitsLocalization() {
    const [settings, SetSettings] = useSettings()
    return (
        <>
            <SegmentHeader title='Units' />
            <SegmentItem>
                <div style={{ width: '100%' }}>
                    <IonLabel>Weight</IonLabel>
                    <IonSelect onIonChange={(e) => SetSettings({ weightUnit: e.detail.value })} value={settings.weightUnit}>
                        <IonSelectOption value='metric'>Metric (kg)</IonSelectOption>
                        <IonSelectOption value='imperial'>US/Imperial (lbs)</IonSelectOption>
                    </IonSelect>
                </div>
            </SegmentItem>
            <SegmentItem>
                <div style={{ width: '100%' }}>
                    <IonLabel>Distance</IonLabel>
                    <IonSelect value={settings.distanceUnit} onIonChange={e => SetSettings({ distanceUnit: e.detail.value })}>
                        <IonSelectOption value='metric'>Metric (m/km)</IonSelectOption>
                        <IonSelectOption value='imperial'>US/Imperial (ft/miles)</IonSelectOption>
                    </IonSelect>
                </div>
            </SegmentItem>
            {/*<SegmentItem>
                <div style={{ width: '100%' }}>
                    <IonLabel>Size</IonLabel>
                    <IonSelect value={settings.sizeUnit} onIonChange={e => SetSettings({ sizeUnit: e.detail.value })}>
                        <IonSelectOption value='metric'>Metric (cm)</IonSelectOption>
                        <IonSelectOption value='imperial'>US/Imperial (in)</IonSelectOption>
                    </IonSelect>
                </div>
            </SegmentItem>*/}
        </>
    )
}

function GeneralSettings() {
    const [settings, SetSettings] = useSettings()
    return (
        <>
            {/*
            <SegmentHeader title='General' />
            <SegmentItem>
                <div>
                    <IonLabel>Sound Effects</IonLabel>
                    <IonLabel className='light-text'>Doesn't include the rest timer alert</IonLabel>
                </div>
                <IonCheckbox checked={settings.soundEffects} onIonChange={e => SetSettings({ soundEffects: e.detail.checked })} slot='end' />
            </SegmentItem>
            <SegmentItem>
                <div>
                    <IonLabel>Keep Screen on during workout</IonLabel>
                </div>
                <IonCheckbox checked={settings.screenAwake} onIonChange={e => SetSettings({ screenAwake: e.detail.checked })} slot='end' />
            </SegmentItem>
            
                <SegmentItem button>
                    <div>
                        <IonLabel>Import Data</IonLabel>
                    </div>
                </SegmentItem>
                <SegmentItem button>
                    <div>
                        <IonLabel>Export Data</IonLabel>
                    </div>
                </SegmentItem>
                <SegmentItem button>
                    <div>
                        <IonLabel>Theme</IonLabel>
                    </div>
                </SegmentItem>
                */}
        </>
    )
}
function RestTimerSettings() {
    const [settings, SetSettings] = useSettings()
    return (
        <>
            <SegmentHeader title='Rest Timer' />
            <SegmentItem>
                <div>
                    <IonLabel>Vibrate upon finish</IonLabel>
                </div>
                <IonCheckbox checked={settings.vibrateOnRestFinish} onIonChange={e => SetSettings({ vibrateOnRestFinish: e.detail.checked })} slot='end' />
            </SegmentItem>
            <SegmentItem>
                <IonLabel>Sound</IonLabel>
                <IonSelect value={settings.restFinishSound} onIonChange={e => {
                    SetSettings({ restFinishSound: e.detail.value })
                    console.log(e)
                }
                }>
                    <IonSelectOption value={""}>None</IonSelectOption>
                    {Object.keys(Sounds).map((s) => {
                        return (
                            <IonSelectOption key={s} value={s}>{s}</IonSelectOption>
                        )
                    })}
                </IonSelect>
            </SegmentItem>
        </>
    )
}

function OtherServices() {
    return (
        <>
            {/*<SegmentHeader title='Other Services' />
            <SegmentItem>
                <div>
                    <IonLabel>Google Fit</IonLabel>
                </div>
                <IonCheckbox slot='end' />
    </SegmentItem>*/}
        </>
    )
}

function ContactSupport() {
    return (
        <>
            {/*<SegmentHeader title='Contact & Support' />
            <SegmentItem button>
                <div>
                    <IonLabel>Accelerate Help Center</IonLabel>
                    <IonText className='light-text'>Refer to our faq before contacting. We are pretty sure they will solve your doubts.</IonText>
                </div>
            </SegmentItem>
            <SegmentItem button>
                <div>
                    <IonLabel>Bug Report</IonLabel>
                </div>
            </SegmentItem>
            <SegmentItem button>
                <div>
                    <IonLabel>Email Support</IonLabel>
                </div>
            </SegmentItem>
            <SegmentItem button>
                <div>
                    <IonLabel>Twitter</IonLabel>
                    <IonText className='light-text'>@accelerate-fitness</IonText>
                </div>
            </SegmentItem>
            <SegmentItem button>
                <div>
                    <IonLabel>Facebook</IonLabel>
                    <IonText className='light-text'>accelerate-fitness</IonText>
                </div>
            </SegmentItem>
            <SegmentItem button>
                <div>
                    <IonLabel>Instagram</IonLabel>
                    <IonText className='light-text'>accelerate-fitness</IonText>
                </div>
    </SegmentItem>*/}
        </>

    )

}


function Legal() {
    return (
        <>
            {/*<SegmentHeader title='Legal Center' />
            <SegmentItem button>
                <div>
                    <IonLabel>Privacy Policy</IonLabel>
                </div>
            </SegmentItem>
            <SegmentItem last button>
                <div>
                    <IonLabel>Terms of service and conditions</IonLabel>
                </div>
    </SegmentItem>*/}
        </>
    )
}
interface SegmentHeaderProps {
    title: string
}
const SegmentHeader: React.FC<SegmentHeaderProps> = (props) => {
    return (
        <IonItem lines='none' className='segment-header'>
            {props.title}
            {props.children}
        </IonItem>
    )
}

interface SegmentItemProps {
    last?: boolean,
    button?: boolean
}
const SegmentItem: React.FC<SegmentItemProps> = (props) => {
    return (
        <IonItem button={props.button} className='segment-item' lines={props.last ? 'full' : 'none'}>
            {props.children}
        </IonItem>
    )
}
export default SettingsPage