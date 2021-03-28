import EventEmitter from "events";
import { Timer, TimerEvents } from "./timer";

export class TimerController {
    static active?: Timer
    static events: TimerEvents = new EventEmitter();
    static Start(secs?: number) {
        if (!TimerController.active || !TimerController.active.running) {
            TimerController.active = new Timer(secs)
            TimerController.active.on('change', TimerController.OnChange)
            TimerController.active.on('finished', TimerController.OnFinished)
        }
    }
    static OnChange = (timeelapsed: number) => {
        TimerController.events.emit('change', timeelapsed);
    }
    static OnFinished = () => {
        TimerController.active?.removeAllListeners()
        TimerController.active = undefined;
        TimerController.events.emit('finished');
    }
    static Cancel() {
        if (TimerController.active) {
            TimerController.active.Stop();
        }
        TimerController.active = undefined;
    }
    static get percent() {
        return TimerController.active?.percent || 0
    }
    static get timeRemaining() {
        let diff = TimerController.active ? TimerController.active.seconds - TimerController.active?.timeelapsed : 0
        return diff >= 0 ? diff : 0
    }
    static get running() {
        return TimerController.active !== undefined;
    }

    static Add(secs: number) {
        if (TimerController.active) {
            TimerController.active.Add(secs)
        }
    }
    static Subtract(secs: number) {
        if (TimerController.active) {
            TimerController.active.Subtract(secs)
        }
    }
}