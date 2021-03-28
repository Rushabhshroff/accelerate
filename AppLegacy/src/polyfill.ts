//@ts-nocheck
String.prototype.formatToTime = function formatToTime() {
    return this.valueOf().replace(/\B(?=(\d{2})+(?!\d))/g, ":").substr(0, 7)
}
Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this.valueOf())
    let hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}
export { }