export declare global {
    interface String {
        formatToTime(): string;
    }
    interface Number {
        toHHMMSS(): string
    }
}