import { IonSpinner } from '@ionic/react'
import React from 'react'

export const Loader: React.FC = props => {
    return (
        <div className='loader'>
            <IonSpinner color='primary' />
        </div>
    )
}