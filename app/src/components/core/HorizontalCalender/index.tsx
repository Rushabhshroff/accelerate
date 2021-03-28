import { IonButton, IonDatetime, IonIcon, IonItem, IonText } from '@ionic/react'
import { chevronDown } from 'ionicons/icons'
import React, { useEffect, useRef } from 'react'
import moment, { Moment } from 'moment'
import './horizontal-calender.scss'
export type HorizontalCalenderProps = {
    selectedDate?: Moment,
    onSelectDate?: (date: Moment) => void,
    hide?: boolean
}
export class HorizontalCalender extends React.PureComponent<HorizontalCalenderProps>{
    scrollRef: HTMLDivElement | null = null
    selectedElemRef: HTMLDivElement | null = null
    offsetDate: Moment | null = null
    state = {
        selectedDate: this.props.selectedDate || moment(),
        selectedMonth: (this.props.selectedDate || moment()).clone().date(1),
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.offsetDate) {
                let day = Number(this.offsetDate.format('DD')) - 1
                let elemWidth = window.innerWidth / 7;
                this.scrollRef?.scrollTo(elemWidth * (day - 1), 0)
            }
        }, 500)
    }
    componentDidUpdate() {
        if (this.offsetDate) {
            let day = Number(this.offsetDate.format('DD')) - 1
            let elemWidth = window.innerWidth / 7;
            this.scrollRef?.scrollTo(elemWidth * (day - 1), 0)
        }
    }
    getDates() {
        let month = moment(this.state.selectedMonth);
        let days = month.daysInMonth()
        month.subtract(1, 'day');
        let dates: Moment[] = []
        for (let i = 0; i < days; i++) {
            dates.push(month.add(1, 'day').clone())
        }
        return dates
    }
    setMonth(month: Moment) {
        this.setState({
            selectedMonth: month
        })
    }
    selectDate(date: Moment) {
        this.setState({
            selectedDate: date
        }, () => {
            if (this.props.onSelectDate) {
                this.props.onSelectDate(date)
            }
        })
    }
    render() {
        return (
            <>
                <div className={`calender-header${this.props.hide ? ' hide' : ''}`}>
                    <IonItem lines='none'>
                        <IonDatetime onIonChange={(e) => {
                            this.setMonth(moment(e.detail.value || this.state.selectedMonth))
                        }} value={this.state.selectedMonth.toString()} displayFormat='MMMM YYYY' pickerFormat='MMMM YYYY' />
                        <IonIcon style={{ margin: 5, fontSize: 16 }} icon={chevronDown} />
                    </IonItem>
                </div>
                <div ref={(ref) => this.scrollRef = ref} className={`horizontal-calender-container${this.props.hide ? ' hide' : ''}`}>
                    {this.getDates().map((date) => {
                        let selected = date.isSame(this.state.selectedDate, 'day')
                        if (selected) {
                            this.offsetDate = date
                        }
                        return (
                            <div onClick={() => this.selectDate(date)} key={date.toString()} ref={(ref) => this.selectedElemRef = ref} className={`calender-item calender-date${selected ? ' selected' : ''}`}>
                                <CalenderDate date={date} />
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}


interface CalenderDateProps {
    date: Moment,
}
const CalenderDate: React.FC<CalenderDateProps> = (props) => {
    return (
        <>
            <IonText>{props.date.format('DD')}</IonText>
            <IonText>{props.date.format('MMM')}</IonText>
        </>
    )
}