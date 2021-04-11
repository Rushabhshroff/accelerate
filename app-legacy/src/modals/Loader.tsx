import { IonSpinner } from '@ionic/react'
import React from 'react'

interface LoaderProps {

}

export default class Loader extends React.Component<LoaderProps>{
    static ref: Loader | null = null
    static show() {
        Loader.ref?.show()
    }
    static hide() {
        Loader.ref?.hide()
    }
    state = {
        show: false
    }
    show() {
        this.setState({ show: true })
    }
    hide() {
        this.setState({ show: false })
    }
    render() {
        if (this.state.show) {
            return (
                <div className='backdrop'>
                    <IonSpinner color='primary' />
                </div>
            )
        } else {
            return null
        }
    }
}