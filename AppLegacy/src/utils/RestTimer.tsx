import EventEmitter from "events";
import { useReducer } from "react";
import Database from "../Database";
import { Settings } from "../pages/Settings/hook";
import Sound from "./Sound";

export default class RestTimer {
    static events: EventEmitter = new EventEmitter()
    static Timers = [
        1 * 60 * 1000,
        2 * 60 * 1000,
        3 * 60 * 1000,
        4 * 60 * 1000
    ]
    static startTime: number
    static endTime: number
    static timeleft: number = 0;
    static _rev: string;
    static get running() {
        return RestTimer.startTime && RestTimer.endTime
    };
    static interval: NodeJS.Timeout
    static difference() {
        if (RestTimer.startTime && RestTimer.endTime) {
            let diff = RestTimer.endTime - RestTimer.startTime;
            return diff;
        } else {
            return 0
        }
    }
    static percentRemaining() {
        if (RestTimer.running) {
            let percent = Math.round((RestTimer.timeleft / RestTimer.difference()) * 100)
            return percent;
        } else {
            return undefined;
        }
    }
    static Load() {
        Database<any>().get('timers').then((res) => {
            RestTimer.Timers = res.timers
            RestTimer._rev = res._rev
            RestTimer.events.emit('change');
        }).catch((err) => {

        })
    }
    static Save() {
        console.log(RestTimer.Timers);
        return Database<any>().put({
            _id: 'timers',
            _rev: RestTimer._rev,
            timers: RestTimer.Timers
        })
    }
    static StartCustom(endTime: number) {
        RestTimer.Timers.unshift(endTime);
        RestTimer.Timers.pop();
        RestTimer.Save();
        return RestTimer.Start(endTime);
    }
    static Start(endTime: number) {
        let now = Date.now()
        RestTimer.endTime = now + endTime;
        RestTimer.startTime = now
        RestTimer.timeleft = RestTimer.endTime - Date.now();
        RestTimer.events.emit('change', RestTimer.timeleft);
        RestTimer.interval = setInterval(() => {
            RestTimer.timeleft = RestTimer.endTime - Date.now();
            RestTimer.events.emit('change', RestTimer.timeleft);
            if (RestTimer.timeleft <= 0) {
                RestTimer.Done();
            }
        }, 1000)
    }
    static Add(time: number) {
        if (RestTimer.endTime) {
            console.log(RestTimer.endTime);
            RestTimer.endTime += time;
            console.log(RestTimer.endTime);
        }
    }
    static Subtract(time: number) {
        if (RestTimer.endTime) {
            RestTimer.endTime -= time;
        }
    }
    static Done() {
        if (Settings.current.restFinishSound) {
            Sound.play(Settings.current.restFinishSound)
        }
        if (Settings.current.vibrateOnRestFinish) {
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(500)
            }
        }
        RestTimer.End()
    }
    static End() {
        RestTimer.startTime = 0;
        RestTimer.endTime = 0
        RestTimer.timeleft = 0;
        if (RestTimer.interval) {
            clearInterval(RestTimer.interval)
        }
        RestTimer.events.emit('change', RestTimer.timeleft);
    }
}