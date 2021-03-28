import { EventEmitter } from 'events'

export interface TimerEvents extends EventEmitter {
    on(ev: 'change', callback: (timeelapsed: number) => void): this
    on(ev: 'finished', callback: () => void): this
}
export class Timer extends EventEmitter implements TimerEvents {
    timeelapsed: number = 0
    private _interval: NodeJS.Timeout
    seconds: number = 0
    running: boolean = false
    constructor(secs?: number) {
        super();
        this.seconds = secs || 120;
        this.running = true;
        this._interval = setInterval(() => {
            this.timeelapsed += 1
            this.emit('change', this.timeelapsed)
            if (this.seconds && this.timeelapsed >= this.seconds) {
                this.Stop()
            }
        }, 1000)
    }
    Add(secs: number) {
        this.seconds += secs
        this.emit('change', this.timeelapsed)
    }
    Subtract(secs: number) {
        this.seconds -= secs
        this.emit('change', this.timeelapsed)
        if (this.timeelapsed >= this.seconds) {
            this.Stop()
        }
    }
    Stop() {
        if (this._interval) {
            clearInterval(this._interval)
        }
        this.emit('finished')
        this.running = false
    }
    get percent() {
        return this.seconds ? (this.timeelapsed / this.seconds) * 100 : 0
    }
}