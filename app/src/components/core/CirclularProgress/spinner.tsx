import React, { useState } from 'react'
import './styles.scss'

export interface Spinner {
    size: number,
    strokeWidth?: number,
    color?: string,
    animate?: boolean
}
export const Spinner: React.FC<Spinner> = (props) => {
    const computedProperties = {
        size: props.size,
        width: props.size,
        height: props.size,
        radius: (props.size / 2) - 5,
        circumference: (props.size - 10) * Math.PI,
        strokeWidth: props.strokeWidth || 3,
        color: props.color || "var(--ion-color-primary)",
        animate: props.animate === false ? false : true
    }
    const { width, height, radius, color, strokeWidth, size, animate } = computedProperties;
    return (
        <div style={{ width: width, height: height }} className='circular-progress'>
            <svg className='spinner' width={width} height={height} viewBox='0 0 200 200'>
                <circle className={`path${animate ? ' animate' : ''}`}
                    r={95}
                    cx={100}
                    cy={100}
                    strokeLinecap='round'
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}>
                </circle>
            </svg>
            <div className='absoulute-content'>
                {props.children}
            </div>
        </div>
    )
}