import { useAppDispatch, useAppSelector } from '@/app/hooks'
import BrandStateSelect from '@/components/BrandStateSelect'
import { GameItem } from '@/components/GameList'
import type { Game } from '@/features/games/gamesApi'
import { useGetGamesQuery } from '@/features/games/gamesApiSlice'
import { GameTilesCode } from '@/features/tiles/GameTilesCode'
import { addGameTile, selectTiles } from '@/features/tiles/tilesSlice'
import {
  Container,
  FormatNumber,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import type { Options } from 'minisearch'
import { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { useMiniSearch } from 'react-minisearch'
import { useParams } from 'react-router'
import { timeAgo } from 'short-time-ago'

const miniSearchOptions: Options = {
  fields: ['name'],
  searchOptions: {
    prefix: term => term.length >= 3,
    fuzzy: term => (term.length >= 3 ? 0.2 : false),
    combineWith: 'AND',
  },
}

const Home = () => {
  const { brand, state } = useParams()
  const { data, isError, isFetching, fulfilledTimeStamp } = useGetGamesQuery({
    brand,
    state,
  })
  const { search, searchResults, clearSearch, addAllAsync, removeAll } =
    useMiniSearch([], miniSearchOptions)
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()
  const tiles = useAppSelector(selectTiles)

  useEffect(() => {
    if (data?.desktop) {
      removeAll()
      addAllAsync(data?.desktop)
    }
  }, [data])

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    search(value)
  }

  const onSuggestionsClearRequested = () => {
    clearSearch()
  }

  const getSuggestionValue = (suggestion: Game) => {
    return suggestion.name
  }

  const renderSuggestion = ({ id, ...game }: Game) => {
    return <GameItem {...game} />
  }

  const renderInputComponent = ({ key, ...inputProps }: any) => (
    <Input {...inputProps} />
  )

  return (
    <Container py={16} maxW={704}>
      <Stack>
        <Heading>Game Search</Heading>
        <HStack justify="flex-end">
          {isFetching ? (
            <Spinner />
          ) : (
            <Text textStyle="xs" color="fg.subtle">
              <FormatNumber value={data!.desktop.length} /> games fetched{' '}
              {fulfilledTimeStamp && timeAgo(new Date(fulfilledTimeStamp))}
            </Text>
          )}
          <BrandStateSelect />
        </HStack>

        {data && (
          <Autosuggest
            suggestions={searchResults ?? []}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={{
              value: query,
              onChange(event, { newValue }) {
                setQuery(newValue)
              },
            }}
            renderInputComponent={renderInputComponent}
            highlightFirstSuggestion
            onSuggestionSelected={(event, { suggestion }) => {
              dispatch(addGameTile(suggestion, { brand, state }))
              setQuery('')
            }}
          />
        )}

        <Heading>Selected Games</Heading>
        {tiles && (
          <ul>
            {tiles.map(tile => (
              <li key={tile.id}>{tile.name}</li>
            ))}
          </ul>
        )}

        <Heading>Game Tiles Code</Heading>
        {tiles && <GameTilesCode tiles={tiles} />}
      </Stack>
    </Container>
  )
}

export default Home
