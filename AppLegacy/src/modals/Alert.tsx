import { IonAlert } from '@ionic/react'
import React from 'react'

interface AlertBoxProps {

}

export default class AlertBox extends React.Component<AlertBoxProps>{
    static ref: AlertBox | null = null;
    state = {
        show: false,
        title: '',
        message: '',
        buttons: [],
        inputs: []
    }
    static Show(title: string, message?: string, buttons?: any[], inputs?: any[]) {
        AlertBox.ref?.show(title, message, buttons, inputs);
    }
    show(title: string, message?: string, buttons?: any[], inputs?: any[]) {
        this.setState({
            show: true,
            title, message, buttons, inputs
        })
    }
    hide() {
        this.setState({
            title: '',
            message: '',
            buttons: [],
            inputs: [],
            show: false
        })
    }
    render() {
        return (
            <IonAlert
                isOpen={this.state.show}
                buttons={this.state.buttons}
                inputs={this.state.inputs}
                message={this.state.message}
                onDidDismiss={this.hide.bind(this)}
                header={this.state.title}
            />
        )
    }
}