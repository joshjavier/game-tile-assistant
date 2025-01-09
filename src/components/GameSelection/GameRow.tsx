import type { ITile } from '@/features/tiles/tilesSlice'
import { Group, IconButton, Table } from '@chakra-ui/react'
import { Tag } from '../ui/tag'
import { LuLink, LuTrash2 } from 'react-icons/lu'
import { ClipboardIconButton, ClipboardRoot } from '../ui/clipboard'
import { Tooltip } from '../ui/tooltip'
import { useId } from 'react'

interface GameRowProps {
  game: ITile
  onRemove?: () => void
}

export const GameRow = ({ game, onRemove }: GameRowProps) => {
  const id = useId()

  return (
    <Table.Row color="fg.muted">
      <Table.Cell fontWeight="semibold" textWrap="pretty">
        {game.name}
      </Table.Cell>
      <Table.Cell>{game.provider}</Table.Cell>
      <Table.Cell lineHeight="tall">
        <Tag>{game.slug}</Tag>
        {game.mobile && (
          <>
            {' '}
            <Tag>{game.mobile}</Tag>
          </>
        )}
      </Table.Cell>
      <Table.Cell textAlign="end">
        <Group>
          <Tooltip ids={{ trigger: id }} content="Copy SmartLink" portalled>
            <ClipboardRoot ids={{ root: id }} value={game.smartlink}>
              <ClipboardIconButton icon={<LuLink />} />
            </ClipboardRoot>
          </Tooltip>
          <Tooltip content="Remove Game" portalled>
            <IconButton
              variant="subtle"
              size="xs"
              colorPalette="red"
              onClick={onRemove}
            >
              <LuTrash2 />
            </IconButton>
          </Tooltip>
        </Group>
      </Table.Cell>
    </Table.Row>
  )
}
