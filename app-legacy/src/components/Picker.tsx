import { IonAlert, IonPicker } from '@ionic/react'
import React from 'react'


export default class PickerBox extends React.Component<any>{
    static ref: PickerBox | null = null;
    state = {
        show: false,
        buttons: [],
        columns: []
    }
    static Show(options: { buttons: any[], columns: any[] }) {
        PickerBox.ref?.show(options);
    }
    show(options: { buttons: any[], columns: any[] }) {
        this.setState({
            buttons: options.buttons,
            columns: options.columns,
            show: true,
        })
    }
    hide() {
        this.setState({
            buttons: [],
            inputs: [],
            show: false
        })
    }
    render() {
        return (
            <IonPicker
                isOpen={this.state.show}
                buttons={this.state.buttons}
                onDidDismiss={this.hide.bind(this)}
                columns={this.state.columns}
            />
        )
    }
}