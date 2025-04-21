import { useAppDispatch, useAppSelector } from '@/app/hooks'
import BrandStateSelect from '@/components/BrandStateSelect'
import { FetchStatus } from '@/components/FetchStatus'
import { useGetGamesQuery } from '@/features/games/gamesApiSlice'
import {
  addGameTile,
  selectTiles,
  tilesCleared,
  tileRemoved,
} from '@/features/tiles/tilesSlice'
import { Container, HStack, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useFuzzySearchList } from '@nozbe/microfuzz/react'
import { useParams } from 'react-router'
import { Headline } from '@/components/Headline'
import { GameSearch } from '@/components/GameSearch'
import { GameSelection } from '@/components/GameSelection'
import { GameTiles } from '@/components/GameTiles'

const Home = () => {
  const { brand, state } = useParams()
  const { data, isError, isFetching, currentData, fulfilledTimeStamp } =
    useGetGamesQuery({
      brand,
      state,
    })
  const dispatch = useAppDispatch()
  const tiles = useAppSelector(selectTiles)

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

  return (
    <Container maxW="3xl" pt="24" pb="60">
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
          <GameSearch
            queryText={queryText}
            searchResults={searchResults}
            search={search}
            loading={isFetching}
            disabled={!currentData}
            onSelect={game => dispatch(addGameTile(game, { brand, state }))}
          />
        </Stack>

        <GameSelection
          tiles={tiles}
          onTileRemove={id => () => dispatch(tileRemoved(id))}
          onTilesClear={() => dispatch(tilesCleared())}
        />

        {tiles.length > 0 && <GameTiles tiles={tiles} />}
      </Stack>
    </Container>
  )
}

export default Home
