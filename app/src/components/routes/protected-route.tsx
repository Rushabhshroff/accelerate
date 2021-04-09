import { IonRedirect, useIonRouter } from '@ionic/react'
import React, { useEffect } from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export const ProtectedRoute: React.FC<RouteProps<any, any>> = (props) => {
    const router = useIonRouter();
    const token = useAuth()
    useEffect(() => {
        if (!token) {
            router.push('/login', 'root')
        }
    },[token])
    return (
        <Route {...props} />
    )
}