var twoDigits = function (oneTwoDigits: any) {
    if (oneTwoDigits < 10) { oneTwoDigits = "0" + oneTwoDigits };
    return oneTwoDigits;
}

export default class Time {
    seconds: number = 0
    minutes: number = 0
    hours: number = 0
    constructor(durationFormValue?: string | number) {
        if (!durationFormValue) {
            return;
        }
        var hmsString = String(durationFormValue);
        var hms = hmsString.match(/^(?:(?:(\d+)\:)?(\d+)\:)?(\d+)$/);
        if (hms === null) {
            throw new TypeError("Parameter " + hmsString +
                " must have the format ((int+:)?int+:)?int+");
        }
        var hoursNumber = +hms[1] || 0;
        var minutesNumber = +hms[2] || 0;
        var secondsNumber = +hms[3] || 0;
        this.seconds = twoDigits(secondsNumber % 60);
        minutesNumber += Math.floor(secondsNumber / 60);
        this.minutes = twoDigits(minutesNumber % 60);
        hoursNumber += Math.floor(minutesNumber / 60);
        this.hours = twoDigits(hoursNumber);
    }
    equals(otherTime: any) {
        return (this.hours === otherTime.hours) &&
            (this.minutes === otherTime.minutes) &&
            (this.seconds === otherTime.seconds);
    };
    toString() {
        return this.hours + ":" + this.minutes + ":" + this.seconds;
    }
    milliseconds() {
        return this.hours * 60 * 60 * 1000 + this.minutes * 60 * 1000 + this.seconds * 1000
    }
}