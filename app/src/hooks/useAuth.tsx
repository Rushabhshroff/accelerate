import { Auth, TokenResult } from '../api'
import { useEffect, useState } from 'react'
export function useAuth() {
    const [token, SetToken] = useState<TokenResult | null>(Auth.token);
    useEffect(() => {
        const OnChange = (token: any) => {
            SetToken(Auth.token)
        }
        Auth.events.on('change', OnChange)
        return () => {
            Auth.events.off('change', OnChange)
        }
    })
    return token
}