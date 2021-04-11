import moment from 'moment'
export function getDaySlotFromTime() {
    let hours = moment().hours()
    if (hours > 12 && hours <= 18) {
        return 'Afternoon'
    }
    if (hours > 18 && hours <= 20) {
        return 'Evening'
    }
    if (hours > 20 && hours <= 24) {
        return 'Night'
    }
    if (hours > 0 && hours <= 4) {
        return 'Late Night'
    }
    if (hours > 4 && hours <= 6) {
        return 'Early Morning'
    }
    if (hours > 6 && hours <= 12) {
        return 'Morning'
    }
}

export function ValueObjectToString(obj: { unit: any, value: any }, format: 'U V' | 'V U' = 'V U') {
    if (format === 'V U') {
        return `${obj.value} ${obj.unit}`
    } else {
        return `${obj.unit} ${obj.value}`
    }
}

export const RandomColor = () => '#' + Math.random().toString(16).substr(2, 6);

export function convertMS(milliseconds: number) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

export function ThemeColor(color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light') {
    let getColor = (variant: string) => getComputedStyle(document.body).getPropertyValue(`--ion-color-${color}${variant ? '-' + variant : ''}`).trim();
    return {
        value: getColor(''),
        variant: getColor
    }
}

export function getVar(name: string) {
    return getComputedStyle(document.body).getPropertyValue(name);

}

export function todayMilli() {
    return new Date().setHours(0, 0, 0, 0);
}