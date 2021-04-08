import { useReducer } from "react";
import { AppSettings } from "../utils";
import { AppTheme } from "../utils/app-theme";

export function useAppSettings() {
    const reducer = (state: AppSettings, action: Partial<AppSettings>) => {
        if (action.theme?.mode !== state.theme.mode) {
            AppTheme.SetMode(action.theme?.mode || AppSettings.current.theme.mode)
        }
        if (action.theme?.primaryColor !== state.theme.primaryColor) {
            AppTheme.SetPrimary(action.theme?.primaryColor || AppSettings.current.theme.primaryColor)
        }
        Object.assign(AppSettings.current, action);
        AppSettings.save();
        return {
            ...state,
            ...action
        } as AppSettings
    }
    return useReducer(reducer, { ...AppSettings.current })
}