import type { Game } from '@/features/games/gamesApi'
import { Stack, Text } from '@chakra-ui/react'

interface GameListProps {
  games: Game[]
}

export const GameList = ({ games }: GameListProps) => {
  return (
    <ul>
      {games.map(({ id, ...game }) => (
        <li key={id}>
          <GameItem {...game} />
        </li>
      ))}
    </ul>
  )
}

type GameItemProps = Omit<Game, 'id'>

export const GameItem = ({ name, game, provider }: GameItemProps) => {
  return (
    <Stack p={3} borderBottomWidth="1px">
      <Text>{name}</Text>
      <Text textStyle="sm" color="fg.muted">
        {game}
      </Text>
    </Stack>
  )
}
