import type { Game } from '@/features/games/gamesApi'
import { Box, Highlight, HStack, IconButton, Text } from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'

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

type GameItemProps = Omit<Game, 'id'> & {
  query?: string[]
  isHighlighted?: boolean
}

export const GameItem = ({
  name,
  game,
  provider,
  isHighlighted,
  query,
}: GameItemProps) => {
  return (
    <HStack
      justify="space-between"
      userSelect="none"
      borderRadius="sm"
      py="1.5"
      px="2"
      bg={{
        base: isHighlighted ? 'bg.muted' : undefined,
        _dark: isHighlighted ? 'bg.emphasized' : undefined,
        _focusWithin: 'bg.muted',
      }}
      transition="backgrounds"
      transitionDuration="fast"
      textStyle="sm"
    >
      <Box>
        <Highlight
          ignoreCase
          query={query || []}
          styles={{ fontWeight: 'semibold' }}
        >
          {name}
        </Highlight>
        <Text textStyle="xs" color="fg.muted">
          {game}
        </Text>
      </Box>
      <IconButton
        variant="ghost"
        aria-label="Add game"
        title="Add game"
        opacity={{
          base: isHighlighted ? 1 : 0,
          _focusVisible: 1,
        }}
      >
        <LuPlus />
      </IconButton>
    </HStack>
  )
}
