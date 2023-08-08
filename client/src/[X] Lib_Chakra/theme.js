// JANG: 08.06 - 다크 모드 해결이 안 됨..

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// SANGYOON: Fonts 설정
import './theme.css';

// 2. Add your color mode config
const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme