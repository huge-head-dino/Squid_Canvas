//SANGYOON: Audio DB추가

import roundSound from '../Audio/audio_round.mp3';
import alarmGameSound from '../Audio/alarm_game.mp3';
import entranceEffect from '../Audio/audio_entrance.mp3';
import submitSound from '../Audio/audio_submit.mp3';
import waitingroomSound from '../Audio/audio_waitingroom.mp3';
import competitionSound from '../Audio/audio_competition.mp3';
import spySound from '../Audio/audio_spy.mp3';
import gameentranceEffect from '../Audio/audio_gamemode_entrance.mp3';
import wrongAnswer from '../Audio/audio_wrong.mp3';
import correctAnswer from '../Audio/audio_correct.mp3';

const RoundMusic = new Audio(roundSound);
const AlarmSound = new Audio(alarmGameSound);
const EntranceEffect = new Audio(entranceEffect);
const SubmitSound = new Audio(submitSound);
const WaitingSound = new Audio(waitingroomSound);
const CompetitionSound = new Audio(competitionSound);
const SpySound = new Audio(spySound);
const GameEntranceEffect = new Audio(gameentranceEffect);
const WrongAnswer = new Audio(wrongAnswer);
const CorrectAnswer = new Audio(correctAnswer);

export {
    RoundMusic,
    AlarmSound,
    EntranceEffect,
    SubmitSound,
    WaitingSound,
    CompetitionSound,
    SpySound,
    GameEntranceEffect,
    WrongAnswer,
    CorrectAnswer
};