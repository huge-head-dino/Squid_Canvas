// ---- SANGYOON: MongoDB 저장
// ---- node db.js
const mongoose = require("mongoose")
const FruitWord = require("../models/fruits");

// ---- MongoDB 연결
// ---- 'express'라는 데이터베이스에 접근
mongoose.connect("mongodb://127.0.0.1:27017/express", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);

// ---- mongoose.connect() 연결 후 연결객체(mongoose.connection)를 db 변수에 저장
const db = mongoose.connection;
const handleOpen = () => console.log("✅ Uploading MongoDB Compass");
const handleError = (error) => console.log("❌ DB Error", error)
db.once("open", handleOpen); //open 이벤트가 발생 시 handleOpen 실행 
db.on("error", handleError); //error 이벤트가 발생할 때마다 handleError 실행

const FruitWords = [
  {
    theme: '과일',
    name: '샤인머스켓'
  },
  {
    theme: '과일',
    name: '파인애플'
  },
  {
    theme: '과일',
    name: '사과'
  },
  // 블루팀용
  {
    theme: '과일',
    name: '달팽이'
  },
  {
    theme: '과일',
    name: '문어'
  },
  // 스파이 모드용
  {
    theme: '과일',
    name: '라이언 일병 구하기'
  },
  {
    theme: '과일',
    name: '백설공주'
  },
  {
    theme: '과일',
    name: '바나나'
  },
  {
    theme: '과일',
    name: '참외'
  },
  {
    theme: '과일',
    name: '오렌지'
  },
  {
    theme: '과일',
    name: '자두'
  },
  {
    theme: '과일',
    name: '코코넛'
  },
  {
    theme: '과일',
    name: '두리안'
  },
  {
    theme: '과일',
    name: '곶감'
  },
  {
    theme: '과일',
    name: '망고'
  },
  {
    theme: '과일',
    name: '복숭아'
  },
  {
    theme: '과일',
    name: '키위'
  },
  {
    theme: '과일',
    name: '수박'
  },
  {
    theme: '과일',
    name: '라임'
  },
  {
    theme: '과일',
    name: '수박'
  }
];

const insertFruitWords = async () => {
  try {
    const result = await FruitWord.insertMany(FruitWords);
    console.log("과일 DB 성공! ", result);
  } catch (error) {
    console.log(error);
  }
};

insertFruitWords();