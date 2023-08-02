// 상태 관리 라이브러리로 'zustand' 사용
import {create} from "zustand";
import axios from "axios";

const APPLICATION_SERVER_URL = 'https://mysquidcanvas.shop/';

const useStore = create((set) => ({
// 상태와 관련된 변수와 함수들을 정의 : create 함수
// 상태를 변경하는 함수(상태 갱신 시, 리액티브하게 컴포넌트 업데이트 됨) : set 함수

  gamers: [],
  setGamers: (gamer) => {
    set((state) => ({
      gamers: [...state.gamers, gamer],
    }));
  },
  deleteGamer: (name) => {
    set((state) => ({
      gamers: state.gamers.filter((a) => a.name !== name), /* a.name이 name과 같지 않은 것만 남김 */
    }));
  },
  clearGamer: () => {
    set((state) => ({
      gamers: [],
    }));
  },

  // MRSEO:
  setDrawable: (drawable, myUserName) => {
    set((state) => ({
      gamers: state.gamers.map((gamer) =>
        gamer.name === myUserName ? { ...gamer, drawable: drawable } : gamer
      ),
    }));
  },

  setCanSeeAns: (canSeeAns, myUserName) => {
    set((state) => ({
      gamers: state.gamers.map((gamer) =>
        gamer.name === myUserName ? { ...gamer, canSeeAns: canSeeAns } : gamer
      ),
    }));
  },

  // 추가!
  curSession: undefined,
  setCurSession: (curSession) => { set({curSession: curSession}) },

  myUserId: undefined,
  setMyUserId: (myUserId) => { set({myUserId: myUserId}) },

  playerCnt: 0,
  setPlayerCount: (playerCnt) => { set({playerCnt: playerCnt}) },

  // MRSEO:
  phase: 'Ready',
  setPhase: (phase) => { set({phase: phase}) },

  whoIsPainter: undefined,
  setWhoIsPainter: (whoIsPainter) => { set({whoIsPainter: whoIsPainter}) },

  redScoreCnt: 0,
  setRedScoreCnt: (redScoreCnt) => { set({redScoreCnt: redScoreCnt}) },

  blueScoreCnt: 0,
  setBlueScoreCnt: (blueScoreCnt) => { set({blueScoreCnt: blueScoreCnt}) },

  round: 1,
  setRound: (round) => { set({round: round}) },
  
  ans: '',
  setAns: (ans) => { set({ans: ans}) },

}));

export default useStore;