export default class MapArray<T>{
    length: number = 0;
    [index: number]: T;
    constructor(items?: T[]) {
        if (items) {
            for (let i = 0; i < items?.length; i++) {
                this[i] = items[i]
                this.length++;
            }
        }
    }
    push(item: T) {
        this[this.length] = item;
        return this.length;
    }
} 
