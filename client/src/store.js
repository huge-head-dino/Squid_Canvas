// 상태 관리 라이브러리로 'zustand' 사용
import {create} from "zustand";
import axios from "axios";

// NOTE: 배포 시, 주소 확인!
const APPLICATION_SERVER_URL = 'https://mysquidcanvas.shop'
// const APPLICATION_SERVER_URL = 'http://localhost:5050';

const useStore = create((set) => ({
// 상태와 관련된 변수와 함수들을 정의 : create 함수
// 상태를 변경하는 함수(상태 갱신 시, 리액티브하게 컴포넌트 업데이트 됨) : set 함수
 
  gamers: [],
  // JANG: gamer 배열 중복 등록 방지 -> 수정
  setGamers: (newGamer) => {
    set((state) => {
      // JANG: 이미 gamers 배열에 동일한 name을 가진 게이머가 존재하는지 확인
      if (state.gamers.some(gamer => gamer.name === newGamer.name)) {
        // 근데 이렇게 하면..동명이인 들어왔을 때, 방이 폭파되기는 하지만..
        return;
      }
      return {
        gamers: [...state.gamers, newGamer],
      }
    });
  },
  deleteGamer: (name) => {
    set((state) => ({
      gamers: state.gamers.filter((a) => a.name !== name),
    }));
  },
  clearGamer: () => {
    set((state) => ({
      gamers: [],
    }));
  },
  // JANG: sortGamer 추가
  sortGamer: () => {
    set((state) => ({
      gamers: state.gamers.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      }),
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

  canSubmitAns: false,
  setCanSubmitAns: (canSubmitAns) => { set({canSubmitAns: canSubmitAns}) },

}));

export default useStore;