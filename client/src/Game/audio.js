//SANGYOON: Audio DB추가

import roundSound from '../Audio/audio_round.mp3';
import alarmGameSound from '../Audio/alarm_game.mp3';
import entranceSound from '../Audio/audio_entrance.mp3';
import submitSound from '../Audio/audio_submit.mp3';
import waitingroomSound from '../Audio/audio_waitingroom.mp3';

const RoundMusic = new Audio(roundSound);
const AlarmSound = new Audio(alarmGameSound);
const EntranceSound = new Audio(entranceSound);
const SubmitSound = new Audio(submitSound);
const WaitingSound = new Audio(waitingroomSound);

export {
    RoundMusic,
    AlarmSound,
    EntranceSound,
    SubmitSound,
    WaitingSound
};