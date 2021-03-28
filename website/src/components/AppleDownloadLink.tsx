import React from 'react'


export function AppleBadge(props:React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>){
    return (
        <a {...props} href="/">
             <img  src="/assets/icon/badge-appstore.svg" alt="Download" />
        </a>
    )
}