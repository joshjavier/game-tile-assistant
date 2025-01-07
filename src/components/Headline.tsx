import { Heading, Text } from '@chakra-ui/react'

export const Headline = () => {
  return (
    <Heading
      as="h1"
      textAlign="center"
      textTransform="uppercase"
      bgImage="linear-gradient(45deg, #f3ec78, #af4261)"
      bgClip="text"
      textStyle="6xl"
      fontWeight="black"
    >
      Game Tiles
      <Text
        as="span"
        display="block"
        textStyle="lg"
        fontWeight="bold"
        fontStyle="italic"
        letterSpacing="1em"
        translate="12px" // optical alignment
      >
        Assemble!
      </Text>
    </Heading>
  )
}
