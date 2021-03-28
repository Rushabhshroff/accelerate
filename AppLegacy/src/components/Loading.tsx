import { IonSpinner } from '@ionic/react'
import React from 'react'

export default function Loading() {
    return (
        <div style={{ height: '100%' }} className='centering-box'>
            <IonSpinner color='primary' />
        </div>
    )
}