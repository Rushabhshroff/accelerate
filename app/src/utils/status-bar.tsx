import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Plugins, StatusBarStyle } from '@capacitor/core'
import { isPlatform } from '@ionic/react'
const { StatusBar } = Plugins

interface StatusbarProps {
    backgroundColor: string,
    barStyle: StatusBarStyle
}
export function SetStatusBarStyle(options: StatusbarProps) {
    if (options.backgroundColor.length === 4) {
        options.backgroundColor += options.backgroundColor.slice(1);
    }
    if (isPlatform('android') && isPlatform('capacitor') && options.backgroundColor.length > 0) {
        StatusBar.setBackgroundColor({ color: options.backgroundColor })
    }
    if (isPlatform('capacitor')) {
        StatusBar.setStyle({ style: options.barStyle })
    }
    if (!isPlatform('capacitor')) {
        let meta = document.getElementsByTagName('meta').namedItem('theme-color');
        if (meta) {
            meta.content = options.backgroundColor
        }
    }
}