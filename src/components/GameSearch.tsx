import type { Game } from '@/features/games/gamesApi'
import { Box, Input, Spinner } from '@chakra-ui/react'
import Autosuggest from 'react-autosuggest'
import { GameItem } from './GameList'
import { InputGroup } from './ui/input-group'
import { LuSearch } from 'react-icons/lu'

interface GameSearchProps {
  query: string
  setQuery: (newValue: string) => void
  searchResults: Game[] | null
  search: (query: string) => void
  clearSearch: () => void
  loading: boolean
  disabled: boolean
  onSelect: (game: Game) => void
}

export const GameSearch = ({
  query,
  setQuery,
  searchResults,
  search,
  clearSearch,
  loading,
  disabled,
  onSelect,
}: GameSearchProps) => {
  return (
    <Box pos="relative">
      <Autosuggest
        suggestions={searchResults ?? []}
        onSuggestionsFetchRequested={({ value }) => search(value)}
        onSuggestionsClearRequested={() => clearSearch()}
        getSuggestionValue={game => game.name}
        renderSuggestion={({ id, ...game }, { query, isHighlighted }) => (
          <GameItem
            {...game}
            query={query.split(' ')}
            isHighlighted={isHighlighted}
          />
        )}
        renderSuggestionsContainer={({ containerProps, children, query }) => {
          const { key, ...menuProps } = containerProps
          return (
            <Box
              key={key}
              pos="absolute"
              width="full"
              bg="bg.panel"
              mt="1"
              boxShadow="lg"
              maxHeight="80"
              overflowY="auto"
              padding="1.5"
              zIndex="dropdown"
              borderRadius="sm"
              hidden={!searchResults ? true : undefined}
              {...menuProps}
            >
              {children}
            </Box>
          )
        }}
        shouldRenderSuggestions={value => value.trim().length > 2}
        inputProps={{
          value: query,
          onChange: (event, { newValue }) => setQuery(newValue),
          type: 'search',
          placeholder: 'Search games',
          disabled,
        }}
        renderInputComponent={inputProps => {
          const { key, ...props } =
            inputProps as Autosuggest.RenderInputComponentProps & {
              key: string
            }
          return (
            <InputGroup
              width="full"
              startElement={loading ? <Spinner size="sm" /> : <LuSearch />}
            >
              <Input
                cursor={loading ? 'wait' : undefined}
                {...props}
                size="xl"
              />
            </InputGroup>
          )
        }}
        highlightFirstSuggestion
        onSuggestionSelected={(event, { suggestion: game }) => {
          onSelect(game)
          setQuery('')
        }}
      />
    </Box>
  )
}
