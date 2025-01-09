import type { ITile } from '@/features/tiles/tilesSlice'
import { Box, For, Heading, HStack, Table } from '@chakra-ui/react'
import { EmptyState } from '../ui/empty-state'
import { GiCardRandom } from 'react-icons/gi'
import { GameRow } from './GameRow'
import { Button } from '../ui/button'

interface GameSelectionProps {
  tiles: ITile[]
  onTilesClear?: () => void
  onTileRemove?: (id: string) => () => void
}

export const GameSelection = ({
  tiles,
  onTilesClear,
  onTileRemove,
}: GameSelectionProps) => {
  return (
    <Box borderWidth="1px" rounded="md" overflow="hidden">
      <Table.Root size="sm" interactive tableLayout="fixed">
        <Table.Header lineHeight="0">
          <Table.Row
            fontSize="0"
            css={{ '& th': { padding: 0, border: 'none' } }}
          >
            <Table.ColumnHeader width="35%">Name</Table.ColumnHeader>
            <Table.ColumnHeader width="20%">Provider</Table.ColumnHeader>
            <Table.ColumnHeader width="30%">Slug</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body
          css={{
            '& tr:last-of-type td': { borderBottomWidth: 0 },
            '& tr:not(:first-of-type) td:first-of-type': {
              paddingInlineStart: 4,
            },
          }}
        >
          <Table.Row>
            <Table.Cell colSpan={4} bg="bg.muted">
              <HStack pl="2" minHeight="8" justify="space-between">
                <Heading textStyle="sm">
                  {tiles.length} {tiles.length === 1 ? 'game' : 'games'}{' '}
                  selected
                </Heading>
                <Button
                  size="xs"
                  colorPalette="red"
                  variant="ghost"
                  onClick={onTilesClear}
                  fontWeight="semibold"
                  hidden={tiles.length === 0}
                >
                  CLEAR
                </Button>
              </HStack>
            </Table.Cell>
          </Table.Row>
          <For
            each={tiles}
            fallback={
              <Table.Row bg="bg">
                <Table.Cell colSpan={4} py="12" asChild>
                  <EmptyState
                    as="td"
                    border="none"
                    icon={<GiCardRandom />}
                    title="Start adding game tiles"
                    description="Games you add will show up here"
                    borderWidth="thin"
                    borderRadius="sm"
                  />
                </Table.Cell>
              </Table.Row>
            }
          >
            {tile => (
              <GameRow
                key={tile.id}
                game={tile}
                onRemove={onTileRemove && onTileRemove(tile.id)}
              />
            )}
          </For>
        </Table.Body>
      </Table.Root>
    </Box>
  )
}
