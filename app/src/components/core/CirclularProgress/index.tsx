import React, { CSSProperties, useState } from 'react'
import './styles.scss'

export interface CircularProgress {
    size: number,
    strokeWidth?: number,
    color?: string,
    percentage: number,
    indefinate?: boolean,
    svgStyles?:CSSProperties
}
export const CircularProgress: React.FC<CircularProgress> = (props) => {
    const computedProperties = {
        size: props.size,
        width: props.size,
        height: props.size,
        radius: (props.size / 2) - 5,
        circumference: (props.size - 10) * Math.PI,
        strokeWidth: props.strokeWidth || 3,
        color: props.color || "var(--ion-color-primary)"
    }
    const { width, height, radius, color, strokeWidth, size, circumference } = computedProperties;
    const percentToOffset = (percentage: number) => {
        return circumference - percentage / 100 * circumference
    }
    const offset = percentToOffset(props.percentage)
    return (
        <div style={{ width: width, height: height }} className='circular-progress'>
            <svg
                className="progress-ring"
                height={height}
                width={width}
                style={props.svgStyles}
            >
                <circle
                    className="progress-ring__circle"
                    strokeWidth={strokeWidth}
                    stroke={color}
                    strokeLinecap='round'
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                >
                </circle>
            </svg>
            <div className='absoulute-content'>
                {props.children}
            </div>
        </div>
    )
}