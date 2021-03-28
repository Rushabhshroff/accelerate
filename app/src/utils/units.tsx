import { evaluate } from 'mathjs'
export class Units {
    static convert(from: string, to: string, value: any) {
        return Number(evaluate(`${value} ${from} to ${to}`).toString().replace(/[^\d]+/g, ''))
    }
}
export interface Units {
    weight: 'kg' | 'lbs',
    distance: 'km' | 'mi',
    size: 'cm' | 'in',
    [key:string]:any
}