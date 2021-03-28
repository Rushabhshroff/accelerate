export interface Best {
    distance: number,
    weight: number,
    time: number,
    [key: string]: number
}

export class Best {
    static Resolve(a: Best, b: Best) {
        for (let key in a) {
            if (b[key]) {
                b
                a[key] = a[key] > b[key] ? a[key] : b[key]
            }
        }
        return a;
    }
}