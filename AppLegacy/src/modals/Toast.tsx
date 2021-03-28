import { IonToast } from '@ionic/react'
import React from 'react'

interface ToastProps {

}

export default class Toast extends React.Component<ToastProps>{
    static ref: Toast | null = null;
    state = {
        show: false,
        message: '',
        buttons: [],
        duration: 1000
    }
    static Show(message?: string, duration?: number, buttons?: any[]) {
        Toast.ref?.show(message, duration, buttons);
    }
    show(message?: string, duration?: number, buttons?: any[]) {
        this.setState({
            show: true,
            message, duration, buttons
        })
    }
    hide() {
        this.setState({
            message: undefined,
            duration: undefined,
            show: false
        })
    }
    render() {
        return (
            <IonToast
                isOpen={this.state.show}
                buttons={this.state.buttons}
                message={this.state.message}
                duration={this.state.duration}
                onDidDismiss={this.hide.bind(this)}
            />
        )
    }
}