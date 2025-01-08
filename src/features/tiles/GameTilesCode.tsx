import type { ITile } from './tilesSlice'
import { CodeBlock } from 'react-code-block'
import { themes } from 'prism-react-renderer'
import { Box, chakra } from '@chakra-ui/react'
import { ClipboardIconButton, ClipboardRoot } from '@/components/ui/clipboard'
import { useColorModeValue } from '@/components/ui/color-mode'

interface Props {
  tiles: ITile[]
}

// Supercharge CodeBlock.Code with Chakra JSX style props
const CodeBlockCode = chakra(CodeBlock.Code)

export const GameTilesCode = ({ tiles }: Props) => {
  const darkMode = useColorModeValue(false, true)

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
    <CodeBlock
      code={code}
      language="html"
      theme={darkMode ? themes.vsDark : themes.github}
    >
      <Box pos="relative">
        <CodeBlockCode
          whiteSpace="pre-wrap"
          bg="bg.panel"
          p={6}
          borderRadius="xl"
          shadow="lg"
          fontSize="sm"
        >
          <CodeBlock.LineContent>
            <CodeBlock.Token />
          </CodeBlock.LineContent>
        </CodeBlockCode>

        <ClipboardRoot value={code} pos="absolute" top="2" right="2">
          <ClipboardIconButton />
        </ClipboardRoot>
      </Box>
    </CodeBlock>
  )
}
