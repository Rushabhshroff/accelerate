import { StatusBarStyle } from "@capacitor/core";
import { AppSettings } from "./app-settings";
import { CSS } from "./css";
import { SetStatusBarStyle } from "./status-bar";

export class AppTheme {
    static Load() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        AppTheme.SetMode(AppSettings.current.theme.mode)
        prefersDark.addEventListener('change', () => {
            AppTheme.SetMode(AppSettings.current.theme.mode);
        });
        AppTheme.SetPrimary(AppSettings.current.theme.primaryColor.toLowerCase())
    }
    static SetMode(mode: 'dark' | 'light' | 'auto') {
        var darkMode = false;
        if (mode == 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            if (prefersDark.matches) {
                document.body.classList.add('dark');
                darkMode = true;
            } else {
                document.body.classList.remove('dark')
            }
        } else {
            if (mode === 'dark') {
                document.body.classList.add('dark');
                darkMode = true;
            } else {
                document.body.classList.remove('dark')
            }

        }
        SetStatusBarStyle({ backgroundColor: CSS.variable('--ion-background-color'), barStyle: darkMode ? StatusBarStyle.Light : StatusBarStyle.Dark })
    }
    static SetPrimary(color: string) {
        Object.entries(asPrimary(PrimaryColorOptions[color])).forEach((k) => {
            document.body.style.setProperty(k[0], k[1] as string)
        })
    }
}

interface ThemeColor {
    color: string;
    color_rgb: string;
    color_contrast: string;
    color_contrast_rgb: string;
    color_shade: string;
    color_tint: string;
}

export const PrimaryColorOptions: { [key: string]: ThemeColor } = {
    "#fc5350": {
        color: "#fc5350",
        color_rgb: "252,83,80",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255, 255, 255",
        color_shade: "#de4946",
        color_tint: "#fc6462"
    },
    "#3880ff": {
        color: "#3880ff",
        color_rgb: "56, 128, 255",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255, 255, 255",
        color_shade: "#3171e0",
        color_tint: "#4c8dff"
    },
    "#0fb9b1": {
        color: "#0fb9b1",
        color_rgb: "15,185,177",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255,255,255",
        color_shade: "#0da39c",
        color_tint: "#27c0b9"
    },
    "#fa8231": {
        color: "#fa8231",
        color_rgb: "250,130,49",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255,255,255",
        color_shade: "#dc722b",
        color_tint: "#fb8f46"
    },
    "#8e44ad": {
        color: "#8e44ad",
        color_rgb: "142,68,173",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255,255,255",
        color_shade: "#7d3c98",
        color_tint: "#9957b5"
    },
    "#2ecc71": {
        color: "#2ecc71",
        color_rgb: "46,204,113",
        color_contrast: "#ffffff",
        color_contrast_rgb: "255,255,255",
        color_shade: "#28b463",
        color_tint: "#43d17f"
    },
    "#f7d794": {
        color: "#f7d794",
        color_rgb: "247,215,148",
        color_contrast: "#000000",
        color_contrast_rgb: "0,0,0",
        color_shade: "#d9bd82",
        color_tint: "#f8db9f"
    },
    "#f8a5c2": {
        color: "#f8a5c2",
        color_rgb: "248,165,194",
        color_contrast: "#000000",
        color_contrast_rgb: "0,0,0",
        color_shade: "#da91ab",
        color_tint: "#f9aec8"
    }
}

function asPrimary(color: ThemeColor):any {
    if(!color){
        return asPrimary(PrimaryColorOptions['#fc5350'])
    }
    return {
        "--ion-color-primary": color.color,
        "--ion-color-primary-rgb": color.color_rgb,
        "--ion-color-primary-contrast": color.color_contrast,
        "--ion-color-primary-contrast-rgb": color.color_contrast_rgb,
        "--ion-color-primary-shade": color.color_shade,
        "--ion-color-primary-tint": color.color_tint,
    }
}