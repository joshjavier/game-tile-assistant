import { useAppDispatch, useAppSelector } from '@/app/hooks'
import BrandStateSelect from '@/components/BrandStateSelect'
import { FetchStatus } from '@/components/FetchStatus'
import { GameItem } from '@/components/GameList'
import { GameSearch } from '@/components/GameSearch'
import { TileList } from '@/components/TileList'
import { InputGroup } from '@/components/ui/input-group'
import type { Game } from '@/features/games/gamesApi'
import { useGetGamesQuery } from '@/features/games/gamesApiSlice'
import { GameTilesCode } from '@/features/tiles/GameTilesCode'
import {
  addGameTile,
  selectTiles,
  tilesCleared,
  tileRemoved,
} from '@/features/tiles/tilesSlice'
import {
  Box,
  Container,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import type { Options } from 'minisearch'
import { useEffect, useState } from 'react'
import Autosuggest from 'react-autosuggest'
import { LuSearch } from 'react-icons/lu'
import { useMiniSearch } from 'react-minisearch'
import { useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Headline } from '@/components/Headline'

const miniSearchOptions: Options = {
  fields: ['name'],
  searchOptions: {
    combineWith: 'AND',
    prefix: true,
    fuzzy: 0.2,
  },
}

const Home = () => {
  const { brand, state } = useParams()
  const { data, isError, isFetching, fulfilledTimeStamp, currentData } =
    useGetGamesQuery({
      brand,
      state,
    })
  const {
    search,
    searchResults,
    clearSearch,
    addAllAsync,
    removeAll,
    isIndexing,
  } = useMiniSearch([], miniSearchOptions)
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()
  const tiles = useAppSelector(selectTiles)

  useEffect(() => {
    if (data?.d) {
      removeAll()

      // On rare occasions, different games will have the same IDs. This will
      // cause a bug when MiniSearch tries to index data with duplicate IDs,
      // such that only the last game with the same index will show up in
      // searches. As a workaround, we'll make sure all game IDs are unique
      // by appending the index of an item to its ID.
      const gameIds = data.d.map(game => game.id)
      const games = data.d.map((game, index) => {
        return gameIds.indexOf(game.id) !== index
          ? { ...game, id: `${game.id}-${index}` }
          : game
      })

      addAllAsync(games)
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

  const renderSuggestion = (
    { id, ...game }: Game,
    { query, isHighlighted }: { query?: string; isHighlighted?: boolean },
  ) => {
    return (
      <GameItem
        {...game}
        isHighlighted={isHighlighted}
        query={query?.split(' ')}
      />
    )
  }

  const renderSuggestionsContainer = ({ containerProps, children, query }) => {
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
        // data-state={searchResults ? 'open' : 'closed'}
        // _open={{ animationStyle: 'slide-fade-in', animationDuration: 'fast' }}
        // _closed={{
        //   animationStyle: 'slide-fade-out',
        //   animationDuration: 'faster',
        // }}
        // animationStyle={{ _open: 'slide-fade-in', _closed: 'slide-fade-out' }}
        {...menuProps}
      >
        {children}
      </Box>
    )
  }

  const renderInputComponent = ({ key, ...inputProps }: any) => (
    <InputGroup
      w="full"
      startElement={
        isFetching || isIndexing ? <Spinner size="sm" /> : <LuSearch />
      }
    >
      <Input
        placeholder="Search games"
        disabled={!currentData}
        cursor={isFetching ? 'wait' : undefined}
        {...inputProps}
      />
    </InputGroup>
  )

  return (
    <Container maxW="3xl" py={24}>
      <Stack gap={10}>
        <Headline />

        <Stack>
          <HStack justify="flex-end">
            <FetchStatus
              status={isError ? 'failed' : isFetching ? 'fetching' : undefined}
              gameCount={data?.d.length ?? 0}
              lastFetched={fulfilledTimeStamp}
            />
            <BrandStateSelect />
          </HStack>
          <Box pos="relative">
            <Autosuggest
              suggestions={searchResults ?? []}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              renderSuggestionsContainer={renderSuggestionsContainer}
              shouldRenderSuggestions={value => value.trim().length > 2}
              inputProps={{
                value: query,
                onChange(event, { newValue }) {
                  setQuery(newValue)
                },
              }}
              renderInputComponent={renderInputComponent}
              highlightFirstSuggestion
              onSuggestionSelected={(event, { suggestion: game }) => {
                dispatch(addGameTile(game, { brand, state }))
                setQuery('')
              }}
            />
          </Box>
        </Stack>

        <Stack>
          <HStack justify="space-between">
            <Heading>Selected Games</Heading>
            {tiles.length > 0 && (
              <Button
                size="xs"
                colorPalette="red"
                variant="subtle"
                onClick={() => dispatch(tilesCleared())}
              >
                Clear
              </Button>
            )}
          </HStack>
          <TileList
            tiles={tiles}
            onTileRemove={id => () => dispatch(tileRemoved(id))}
          />
        </Stack>

        <Stack>
          <Heading>Game Tiles Code</Heading>
          {tiles && <GameTilesCode tiles={tiles} />}
        </Stack>
      </Stack>
    </Container>
  )
}

export default Home
