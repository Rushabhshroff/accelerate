import { evaluate } from 'mathjs'
import { AppSettings } from './app-settings'
import { StringUtils } from './string-utils'
export class Units {
    static convert(from: string, to: string, value: any) {
        return Number(evaluate(`${value} ${from} to ${to}`).toString().replace(/[^\d]+/g, ''))
    }
}
export interface Units {
    weight: 'kg' | 'lbs',
    distance: 'km' | 'mi',
    size: 'cm' | 'in',
    [key: string]: any
}
export const units = ['kg', 'lbs', 'km', 'mi', 'cm', 'in', '%']
export const ContrastUnitMap = {
    'kg': 'lbs',
    'lbs': 'kg',
    'km': 'mi',
    'mi': 'km',
    'cm': 'in',
    'in': 'cm',
    '%': '%',
    '': ''
}
const SettingsMap: any = {
    'kg': 'weight',
    'lbs': 'weight',
    'km': 'distance',
    'mi': 'distance',
    'cm': 'size',
    'in': 'size'
}
const metric = ['kg', 'cm', 'km', '%', '']
const imperial = ['lbs', 'in', 'mi', '%', '']
export class Unit {
    _unit: 'kg' | 'lbs' | 'km' | 'mi' | 'cm' | 'in' | '%' | '' = ''
    value: number = 0;
    static parse(str: string) {
        let _unit: 'kg' | 'lbs' | 'km' | 'mi' | 'cm' | 'in' | '%' | '' = ''
        str = str.replace(/ /g, '')
        for (let unit of units) {
            if (str.includes(unit)) {
                //@ts-ignore
                _unit = unit
            }
        }
        let no = StringUtils.SanitizeToNumber(str);
        if (Math.round(no) !== no) {
            no = Number(no.toFixed(1))
        }
        return new Unit({ _unit, value: no })
    }
    constructor(options: { value: number, _unit: 'kg' | 'lbs' | 'km' | 'mi' | 'cm' | 'in' | '%' | '' }) {
        this.value = options.value
        this._unit = options._unit
    }

    get imperial() {
        if (imperial.includes(this._unit)) {
            return this;
        } else {
            let conv = evaluate(`${this.value} ${this._unit} to ${ContrastUnitMap[this._unit]}`).toString();
            return Unit.parse(conv)
        }
    }
    get metric() {
        if (metric.includes(this._unit)) {
            return this;
        } else {
            let conv = evaluate(`${this.value} ${this._unit} to ${ContrastUnitMap[this._unit]}`).toString();
            return Unit.parse(conv)
        }
    }
    toString(decimals: number = 1) {
        return `${this.value.toFixed(decimals)}${this._unit}`
    }
    get current() {
        let qty = SettingsMap[this._unit] || undefined
        if (qty) {
            let ut = AppSettings.current.units[qty]
            if (imperial.includes(ut)) {
                return this.imperial
            } else {
                return this.metric
            }
        } else {
            return this
        }
    }
    isPossibleConvertion(as: 'kg' | 'lbs' | 'km' | 'mi' | 'cm' | 'in' | '%' | '') {
        return this._unit === ContrastUnitMap[as]
    }
    asOrCurrent(as?: 'kg' | 'lbs' | 'km' | 'mi' | 'cm' | 'in' | '%' | '') {
        if (as && this.isPossibleConvertion(as)) {
            if (imperial.includes(as)) {
                return this.imperial
            } else {
                return this.metric
            }
        } else {
            return this.current;
        }
    }
}