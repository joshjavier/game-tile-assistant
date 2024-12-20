import BrandStateSelect from "@/components/BrandStateSelect"
import { Container, Group, Heading, Input, Stack } from "@chakra-ui/react"

const Home = () => {
  return (
    <Container py={16} maxW={704}>
      <Stack>
        <Heading>Game Search</Heading>
        <Group attached>
          <BrandStateSelect />
          <Input placeholder="Search games" />
        </Group>
      </Stack>
    </Container>
  )
}

export default Home
