import { For, HStack, IconButton, Stack } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { EmptyState } from './ui/empty-state'
import { GiCardRandom } from 'react-icons/gi'
import type { ITile } from '@/features/tiles/tilesSlice'

interface TileListProps {
  tiles: ITile[]
  onTileRemove?: (id: string) => () => void
}

export const TileList = ({ tiles, onTileRemove }: TileListProps) => {
  return (
    <Stack>
      <For
        each={tiles}
        fallback={
          <EmptyState
            icon={<GiCardRandom />}
            title="Start adding game tiles"
            description="Games you add will show up here"
            borderWidth="thin"
            borderRadius="sm"
          />
        }
      >
        {tile => (
          <TileItem
            key={tile.id}
            label={tile.name}
            onRemove={onTileRemove && onTileRemove(tile.id)}
          />
        )}
      </For>
    </Stack>
  )
}

interface TileItemProps {
  label: string
  onRemove?: () => void
}

export const TileItem = ({ label, onRemove }: TileItemProps) => {
  return (
    <HStack
      justify="space-between"
      borderRadius="sm"
      textStyle="sm"
      p="3"
      borderWidth="1px"
      fontWeight="medium"
    >
      {label}
      <HStack>
        <IconButton variant="ghost" onClick={onRemove}>
          <LuTrash2 />
        </IconButton>
      </HStack>
    </HStack>
  )
}
