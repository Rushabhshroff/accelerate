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
    if (isPlatform('android') && isPlatform('capacitor')) {
        StatusBar.setBackgroundColor({ color: options.backgroundColor })
    }
    if(isPlatform('capacitor')){
        StatusBar.setStyle({style:options.barStyle})
    }
    let meta = document.getElementsByTagName('meta').namedItem('theme-color');
    if(meta){
        meta.content = options.backgroundColor
    }
}