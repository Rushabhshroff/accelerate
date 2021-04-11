import React from 'react'


export function GooglePlayBadge(props:React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {full?:number}){
    return (
        <a target='_blank' referrerPolicy='no-referrer' {...props} href="https://play.google.com/store/apps/details?id=fitness.accelerate">
             <img src={`/assets/icon/google-play-badge${props.full?'-full':''}.svg`} alt="Download" />
        </a>
    )
}