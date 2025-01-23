import type { ITile } from '@/features/tiles/tilesSlice'
import { Stack } from '@chakra-ui/react'
import { GameTile } from './GameTile'

interface Props {
  tiles: ITile[]
}

export const GameTilesPreview = ({ tiles }: Props) => {
  return (
    <Stack
      gap="5"
      p="4"
      maxWidth="718px"
      lineHeight="tall"
      borderWidth="thin"
      borderRadius="md"
      bg="white"
      color="black"
    >
      <p>
        <strong>
          {tiles.length === 1
            ? 'Click Tile Below To Play Eligible Game:'
            : 'Click Tiles Below To Play Eligible Games:'}
        </strong>
      </p>
      <Stack
        direction="row"
        gap="1"
        wrap="wrap"
        css={{ '& > a': { flexShrink: 0 } }}
      >
        {tiles.map(tile => (
          <GameTile tile={tile} />
        ))}
      </Stack>
    </Stack>
  )
}
