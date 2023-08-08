import { Flex, Heading, Box, Text, Button, Spacer, HStack, IconButton } from "@chakra-ui/react"
import { NotAllowedIcon } from "@chakra-ui/icons"

export default function Navbar() {
  return (
    <Flex
      as="nav"
      p="10px"
      height="min-content"
      width="100%"
      alignItems="center"
    >
      <Heading as="h1" className="logo">
        <a href="https://mysquidcanvas.shop" style={{ color: "springgreen" }} >JUNGLE CANVAS</a>
      </Heading>
      <Spacer />
      <HStack spacing="20px">
        <IconButton
          variant="outline"
          colorScheme="red"
          aria-label="mute/unmute music"
          icon={<NotAllowedIcon />}
          className="musicButton"
        >
          (음악끄기)
        </IconButton>
      </HStack>
    </Flex>
  );
}