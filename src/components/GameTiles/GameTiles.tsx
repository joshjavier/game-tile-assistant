import { Tabs } from '@chakra-ui/react'
import { GameTilesPreview } from './GameTilesPreview'
import { GameTilesCode } from './GameTilesCode'
import type { ITile } from '@/features/tiles/tilesSlice'

interface GameTilesProps {
  tiles: ITile[]
}

export const GameTiles = ({ tiles }: GameTilesProps) => {
  return (
    <Tabs.Root defaultValue="preview" variant="subtle">
      <Tabs.List>
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">
        <GameTilesPreview tiles={tiles} />
      </Tabs.Content>
      <Tabs.Content value="code">
        <GameTilesCode tiles={tiles} />
      </Tabs.Content>
    </Tabs.Root>
  )
}
