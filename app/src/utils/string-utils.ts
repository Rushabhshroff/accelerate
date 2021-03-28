export class StringUtils {
    static SanitizeToNumber(str: string) {
        return Number(str.replace(/[^\d.]+/g, '')) || 0
    }
    static SanitizeToWholeNumber(str: string) {
        return Number(str.replace(/[^\d]+/g, '')) || 0
    }
    static SanitizeToDurationHHMMSS(str: string) {
        let sant = str.replace(/[^\d]+/g, '').replace(/^0+/, '')
        if (sant.length > 0) {
            sant = sant.padStart(4, '0')
        }
        return sant.replace(/\B(?=(\d{2})+(?!\d))/g, ':').substr(0, 7)
    }
}