import { Flex, Heading, Box, Text, Button, Spacer, HStack, IconButton } from "@chakra-ui/react"
import { NotAllowedIcon } from "@chakra-ui/icons"

export default function Navbar() {
  return (
    // @2 이후부터, 헤더(네비게이션 바)
    <Flex as="nav" p="10px" height="min-content" width="100%" alignItems="center">
      <Heading as="h1"><a href="https://mysquidcanvas.shop">JUNGLE CANVAS</a></Heading>
      <Spacer />                    {/* 나머지 사용 가능한 공간을 다 차지 -> 오른쪽으로 요소들을 밀어냄*/}
      <HStack spacing="20px">       {/* 수평으로 요소들을 정렬하는데, 자식 요소들 사이의 간격 20px로 설정 */}
        <IconButton variant="outline" colorScheme="red" aria-label="mute/unmute music" icon={<NotAllowedIcon/>}>(음악끄기)</IconButton>
        <Button colorScheme="red"><a href="https://mysquidcanvas.shop">EXIT</a></Button>
      </HStack>
    </Flex>
    
  )
}