import type { Game } from '@/features/games/gamesApi'
import { Box, Input, Spinner } from '@chakra-ui/react'
import Autosuggest from 'react-autosuggest'
import { GameItem } from './GameList'
import { InputGroup } from './ui/input-group'
import { LuSearch } from 'react-icons/lu'
import type { HighlightRanges } from '@nozbe/microfuzz'
import { useState } from 'react'
import { useParams } from 'react-router'
import { useGetGamesQuery } from '@/features/games/gamesApiSlice'
import { useFuzzySearchList } from '@nozbe/microfuzz/react'
import { useDebounceCallback } from 'usehooks-ts'

type SearchResult = { item: Game; highlightRanges: HighlightRanges | null }

interface GameSearchProps {
  // query: string
  // setQuery: (newValue: string) => void
  // searchResults: SearchResult[]
  // search: (query: string) => void
  // clearSearch: () => void
  // loading: boolean
  // disabled: boolean
  onSelect: (game: Game) => void
}

export const GameSearch = ({
  // query,
  // setQuery,
  // searchResults,
  // search,
  // clearSearch,
  // loading,
  // disabled,
  onSelect,
}: GameSearchProps) => {
  const [value, setValue] = useState('')
  // const [suggestions, setSuggestions] = useState<SearchResult[]>([])

  const { brand, state } = useParams()
  const {
    data,
    isFetching: loading,
    currentData,
  } = useGetGamesQuery({ brand, state })

  const [queryText, search] = useState('')
  const searchResults = useFuzzySearchList({
    list: data?.d ?? [],
    queryText,
    getText: item => [item.name],
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
  })
  const debouncedSearch = useDebounceCallback(search, 250)

  const onSuggestionsFetchRequested: Autosuggest.SuggestionsFetchRequested = ({
    value,
    reason,
  }) => {
    console.log(`suggestions fetch requested for ${value} because ${reason}`)
    if (reason === 'input-changed') {
      debouncedSearch(value.trim())
    } else {
      search(value.trim())
    }
  }

  const onSuggestionsClearRequested: Autosuggest.OnSuggestionsClearRequested =
    () => {
      console.log('suggestions clear requested')
      search('')
    }

  const onSuggestionsSelected: Autosuggest.OnSuggestionSelected<
    SearchResult
  > = (event, data) => {
    console.log(`suggestions selected ${data.suggestionValue}`)
    onSelect(data.suggestion.item)
    setValue('')
    search('')
  }

  return (
    <Box pos="relative">
      <Autosuggest
        suggestions={queryText === '' ? [] : searchResults}
        // onSuggestionHighlighted={({ suggestion }) => {
        //   console.log('suggestion highlighted')
        //   console.log(suggestion)
        // }}
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
              {children}
            </Box>
          )
        }}
        inputProps={{
          value,
          onChange: (event, { newValue }) => setValue(newValue),
          type: 'search',
          placeholder: 'Search games',
          disabled: !currentData,
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
