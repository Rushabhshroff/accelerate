
import React, { Component } from 'react';

import './ProgressCircle.scss'

export default function ProgressCircle(props: ProgressCircleProps) {
    const defaultProps = {
        color: 'var(--ion-color-primary)',
        radius: 20,
        percent: 0,
        borderWidth: 2,
        bgcolor: 'var(--ion-color-light)',
        innerColor: 'var(--background)',
        disabled: false,
        textStyle: '',
    };
    const percent = props.percent || defaultProps.percent;
    let leftTransformerDegree = '0deg';
    let rightTransformerDegree = '0deg';
    if (percent >= 50) {
        rightTransformerDegree = '180deg';
        leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
    } else {
        rightTransformerDegree = percent * 3.6 + 'deg';
        leftTransformerDegree = '0deg';
    }
    const borderWidth = (props.borderWidth && props.borderWidth < 2) || !props.borderWidth ? 2 : props.borderWidth;
    return (
        <div
            slot={props.slot}
            className="progress-circle"
            style={{
                width: ((props.radius || defaultProps.radius) || defaultProps.radius) * 2,
                height: (props.radius || defaultProps.radius) * 2,
                borderRadius: (props.radius || defaultProps.radius),
                backgroundColor: props.bgcolor || defaultProps.bgcolor,
            }}
        >
            <div
                className="left-wrap"
                style={{
                    width: (props.radius || defaultProps.radius),
                    height: (props.radius || defaultProps.radius) * 2,
                    left: 0,
                }}
            >
                <div
                    className="loader"
                    id="id1"
                    style={{
                        left: (props.radius || defaultProps.radius),
                        width: (props.radius || defaultProps.radius),
                        height: (props.radius || defaultProps.radius) * 2,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: props.color || defaultProps.color,
                        transform: 'rotate(' + leftTransformerDegree + ')',
                    }}
                />
            </div>
            <div
                className="right-wrap"
                style={{
                    width: (props.radius || defaultProps.radius),
                    height: (props.radius || defaultProps.radius) * 2,
                    left: (props.radius || defaultProps.radius),
                }}
            >
                <div
                    className="loader2"
                    id="id2"
                    style={{
                        left: -(props.radius || defaultProps.radius),
                        width: (props.radius || defaultProps.radius),
                        height: (props.radius || defaultProps.radius) * 2,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        backgroundColor: props.color || defaultProps.color,
                        transform: 'rotate(' + rightTransformerDegree + ')',
                    }}
                />
            </div>
            <div
                className="inner-circle"
                style={{
                    left: borderWidth,
                    top: borderWidth,
                    width: ((props.radius || defaultProps.radius) - borderWidth) * 2,
                    height: ((props.radius || defaultProps.radius) - borderWidth) * 2,
                    borderRadius: (props.radius || defaultProps.radius) - borderWidth,
                    backgroundColor: props.innerColor || defaultProps.innerColor,
                }}
            >
                {props.children ? props.children : <span className={'text ' + props.textStyle}>{props.percent}%</span>}
            </div>
        </div>
    )
}

type ProgressCircleProps = {
    color?: string,
    bgcolor?: string,
    innerColor?: string,
    radius?: number,
    percent?: number,
    borderWidth?: number,
    textStyle?: string,
    children?: React.ReactNode,
    slot?:string
};
type ProgressCircleState = {
    percent: number,
    borderWidth: number,
    leftTransformerDegree: string,
    rightTransformerDegree: string,
}