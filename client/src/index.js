import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './[X] Lib_Chakra/reportWebVitals';
import * as serviceWorker from './[X] Lib_Chakra/serviceWorker';

// Chakra UI
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeScript } from '@chakra-ui/react';
import theme from './[X] Lib_Chakra/theme'


// JANG: App 컴포넌트 변경
import Webcam from './Openvidu/Webcam';
// import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

const customTheme = extendTheme({
  fonts: {
    body: '"OAGothic-ExtraBold", sans-serif', // 폰트 이름을 정확하게 지정
    heading: '"OAGothic-ExtraBold", sans-serif', // 폰트 이름을 정확하게 지정
  },
});

root.render(
  <StrictMode>
    <ChakraProvider theme={customTheme}>
      {/* JANG: 08.06 - 다크 모드 해결이 안 됨.. */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Webcam />
    </ChakraProvider>
  </StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
