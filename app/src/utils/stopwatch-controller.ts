import EventEmitter from "events";
import { Timer, TimerEvents } from "./timer";

export class StopwatchController {
    static active?: Timer
    static events: TimerEvents = new EventEmitter();
    static Start() {
        if (!StopwatchController.active || !StopwatchController.active.running) {
            StopwatchController.active = new Timer()
            StopwatchController.active.on('change', StopwatchController.OnChange)
            StopwatchController.active.on('finished', StopwatchController.OnFinished)
        }
    }
    static OnChange = (timeelapsed: number) => {
        StopwatchController.events.emit('change', timeelapsed);
    }
    static OnFinished = () => {
        StopwatchController.active?.removeAllListeners();
        StopwatchController.active = undefined;
        StopwatchController.events.emit('finished');
    }
    static Cancel() {
        if (StopwatchController.active) {
            StopwatchController.active.Stop();
        }
    }
    static get timeElapsed() {
        return StopwatchController.active?.timeelapsed || 0
    }
    static get running() {
        return StopwatchController.active !== undefined;
    }
}