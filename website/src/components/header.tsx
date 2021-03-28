import React from 'react'
import { Link } from 'react-router-dom'
import { HeaderLinks } from '../DataMap'
import {AppleBadge,GooglePlayBadge} from '.'
import './header.scss'
export interface HeaderProps {

}
export const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header className='container'>
            <div className='brand'>
                <img style={{maxHeight:60}} src="/assets/icon/logo_header.svg" alt="Logo" />
            </div>
            <GooglePlayBadge className='link' style={{ height: 50, width: 150 }} />
        </header>
    )
}

interface HeaderLinkProps {
    href: string,
    name: string
}
export const HeaderLink: React.FC<HeaderLinkProps> = (props) => {
    return (
        <Link className='hover-underline link' to={props.href}>{props.name}</Link>
    )
}