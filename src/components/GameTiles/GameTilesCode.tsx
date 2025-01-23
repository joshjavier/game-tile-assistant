import type { ITile } from '@/features/tiles/tilesSlice'
import { CodeBlock } from 'react-code-block'
import { Box, chakra, Theme } from '@chakra-ui/react'
import { ClipboardIconButton, ClipboardRoot } from '@/components/ui/clipboard'
import { Tooltip } from '../ui/tooltip'
import { useId } from 'react'

interface Props {
  tiles: ITile[]
}

// Supercharge CodeBlock.Code with Chakra JSX style props
const CodeBlockCode = chakra(CodeBlock.Code)

export const GameTilesCode = ({ tiles }: Props) => {
  const id = useId()

  if (tiles.length < 1) {
    return
  }

  const heading = () => {
    return tiles.length === 1
      ? `<p><strong>Click Tile Below To Play Eligible Game:</strong></p>`
      : tiles.length > 1
        ? `<p><strong>Click Tiles Below To Play Eligible Games:</strong></p>`
        : null
  }

  const codeline = ({ tile }: { tile: ITile }) =>
    `<a href="${tile.smartlink}"><img alt="${tile.name}" src="${tile.image}" width="100" height="100" style="border: 5px solid #FFFFFF;"></a>`

  const code = `${heading()}
<p>
${tiles.map(tile => codeline({ tile })).join('\n')}
</p>`

  return (
    <CodeBlock code={code} language="html">
      <Box pos="relative">
        <CodeBlockCode
          whiteSpace="pre-wrap"
          bg="gray.900"
          p={6}
          rounded="md"
          shadow="xl"
          maxH="80vh"
          overflow="auto"
          fontSize="sm"
          overscrollBehavior="contain"
        >
          <CodeBlock.LineContent>
            <CodeBlock.Token />
          </CodeBlock.LineContent>
        </CodeBlockCode>
        <Theme appearance="dark" colorPalette="teal">
          <Tooltip ids={{ trigger: id }} content="Copy HTML Markup" portalled>
            <ClipboardRoot
              ids={{ root: id }}
              value={code}
              pos="absolute"
              top="2"
              right="2"
            >
              <ClipboardIconButton />
            </ClipboardRoot>
          </Tooltip>
        </Theme>
      </Box>
    </CodeBlock>
  )
}
