import { useIonRouter } from '@ionic/react'
import React, { useEffect } from 'react'
import {  Route, RouteProps } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export const AuthRoute: React.FC<RouteProps> = (props) => {
    const router = useIonRouter()
    const token = useAuth()
    useEffect(() => {
        if (token) {
            window.location.replace('/home')
        }
    },[token])
    return <Route {...props} />
}