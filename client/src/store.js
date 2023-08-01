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
      gamers: state.gamers.filter((a) => a.name !== name),
    }));
  },
  clearGamer: () => {
    set((state) => ({
      gamers: [],
    }));
  },
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


  // 추가!
  curSession: undefined,
  setCurSession: (curSession) => { set({curSession: curSession}) },

  playerCount: 0,
  setPlayerCount: (playerCount) => { set({playerCount: playerCount}) },

  myUserId: undefined,
  setMyUserId: (myUserId) => { set({myUserId: myUserId}) },

  gameStart: false,
  setGameStart: (gameStart) => { set({gameStart: gameStart}) },

  gameEnd: false,
  setGameEnd: (gameEnd) => { set({gameEnd: gameEnd}) },

  myIndex: 10000,
  setMyIndex: (myIndex) => { set({myIndex: myIndex}) },

}));

export default useStore;