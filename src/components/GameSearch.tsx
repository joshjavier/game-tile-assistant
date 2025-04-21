import type { Game } from '@/features/games/gamesApi'
import { Box, Center, Input, Spinner } from '@chakra-ui/react'
import Autosuggest from 'react-autosuggest'
import { GameItem } from './GameList'
import { InputGroup } from './ui/input-group'
import { LuSearch } from 'react-icons/lu'
import type { HighlightRanges } from '@nozbe/microfuzz'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

type SearchResult = { item: Game; highlightRanges: HighlightRanges | null }

interface GameSearchProps {
  queryText: string
  searchResults: SearchResult[]
  search: (query: string) => void
  loading: boolean
  disabled: boolean
  onSelect: (game: Game) => void
}

export const GameSearch = ({
  queryText,
  searchResults,
  search,
  loading,
  disabled,
  onSelect,
}: GameSearchProps) => {
  const [value, setValue] = useState('')

  const debouncedSearch = useDebouncedCallback(search, 300)

  const onSuggestionsFetchRequested: Autosuggest.SuggestionsFetchRequested = ({
    value,
    reason,
  }) => {
    if (reason === 'input-changed') {
      debouncedSearch(value.trim())
    } else {
      search(value.trim())
    }
  }

  const onSuggestionsClearRequested: Autosuggest.OnSuggestionsClearRequested =
    () => {
      search('')
    }

  const onSuggestionsSelected: Autosuggest.OnSuggestionSelected<
    SearchResult
  > = (event, data) => {
    onSelect(data.suggestion.item)
    setValue('')
    search('')
  }

  return (
    <Box pos="relative">
      <Autosuggest
        suggestions={queryText === '' ? [] : searchResults}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionsSelected}
        getSuggestionValue={suggestion => suggestion.item.name}
        renderSuggestion={(
          { item, highlightRanges },
          { query, isHighlighted },
        ) => (
          <GameItem
            {...item}
            ranges={highlightRanges}
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
              hidden={queryText === '' ? true : undefined}
              {...menuProps}
            >
              {!debouncedSearch.isPending() && searchResults.length === 0 && (
                <Center padding="8">No matching games found.</Center>
              )}
              {children}
            </Box>
          )
        }}
        inputProps={{
          value,
          onChange: (event, { newValue }) => setValue(newValue),
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
      />
    </Box>
  )
}
