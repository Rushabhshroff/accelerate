export type Sounds = keyof typeof Sounds

export const Sounds = {
    "boxing_bell": "boxing_bell.mp3",
    "delightful": "delightful.mp3",
    "melody": "melody_chime.mp3",
    "radar": "radar.mp3",
    "short_bell": "short_bell.pm3",
    "tritone": "tritone_revised.mp3",
}
export default class Sound {
    static play(aud: Sounds) {
        let audio = new window.Audio(`/assets/sounds/${Sounds[aud]}`);
        audio.play()
    }
}