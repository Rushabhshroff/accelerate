export class URLUtils {
    static get current() {
        return class {
            static get queryParams() {
                return new URL(window.location.href).searchParams
            }
        }
    }
}