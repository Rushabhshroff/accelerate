import { IonRedirect, useIonRouter } from '@ionic/react'
import React, { useEffect } from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export const AuthRoute: React.FC<RouteProps> = (props) => {
    const router = useIonRouter()
    const token = useAuth()
    useEffect(() => {
        if (token) {
            router.push('/home', 'root')
        }
    },[token])
    return <Route {...props} />
}