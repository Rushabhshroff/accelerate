import convert from 'convert-units'
import { Settings } from '../pages/Settings/hook'
type Unit = 'kg' | 'lb' | 'km' | 'mi' | 'cm' | 'in'
export function Unit(system: 'metric' | 'imperial' | undefined, qty: 'weight' | 'distance' | 'size'): Unit {
    return {
        weight: {
            metric: 'kg',
            imperial: 'lb'
        },
        distance: {
            metric: 'km',
            imperial: 'mi'
        },
        size: {
            metric: 'cm',
            imperial: 'in'
        }
    }[qty][system || 'metric'] as Unit
}

export function Invert(system: 'metric' | 'imperial', qty: 'weight' | 'distance' | 'size', value: number) {
    let currentUnit = Unit(system, qty);
    let invertedUnit = Unit(system === 'imperial' ? 'metric' : 'imperial', qty);
    return Number(convert(value).from(currentUnit).to(invertedUnit).toExponential(2));
}

export function Convert(from: 'metric' | 'imperial', to: 'metric' | 'imperial', unit: 'weight' | 'distance' | 'size', value: number) {
    if (from !== to) {
        return Number(convert(value).from(Unit(from, unit)).to(Unit(to, unit)).toExponential(2))
    } else {
        return value;
    }
}