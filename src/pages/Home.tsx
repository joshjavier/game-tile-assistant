import { useAppDispatch, useAppSelector } from '@/app/hooks'
import BrandStateSelect from '@/components/BrandStateSelect'
import { FetchStatus } from '@/components/FetchStatus'
// import type { Game } from '@/features/games/gamesApi'
import { useGetGamesQuery } from '@/features/games/gamesApiSlice'
import {
  addGameTile,
  selectTiles,
  tilesCleared,
  tileRemoved,
} from '@/features/tiles/tilesSlice'
import { Container, HStack, Stack } from '@chakra-ui/react'
// import type { Options } from 'minisearch'
// import { useEffect, useState } from 'react'
// import { useMiniSearch } from 'react-minisearch'
// import { useFuzzySearchList } from '@nozbe/microfuzz/react'
import { useParams } from 'react-router'
import { Headline } from '@/components/Headline'
import { GameSearch } from '@/components/GameSearch'
import { GameSelection } from '@/components/GameSelection'
import { GameTiles } from '@/components/GameTiles'

// const miniSearchOptions: Options = {
//   fields: ['name'],
//   searchOptions: {
//     combineWith: 'AND',
//     prefix: true,
//     fuzzy: 0.2,
//   },
// }

const Home = () => {
  const { brand, state } = useParams()
  const { data, isError, isFetching, fulfilledTimeStamp } = useGetGamesQuery({
    brand,
    state,
  })
  const dispatch = useAppDispatch()
  const tiles = useAppSelector(selectTiles)

  // useEffect(() => {
  //   if (data?.d) {
  //     // removeAll()

  //     // On rare occasions, different games will have the same IDs. This will
  //     // cause a bug when MiniSearch tries to index data with duplicate IDs,
  //     // such that only the last game with the same index will show up in
  //     // searches. As a workaround, we'll make sure all game IDs are unique
  //     // by appending the index of an item to its ID.
  //     const gameIds = data.d.map(game => game.id)
  //     const games = data.d.map((game, index) => {
  //       return gameIds.indexOf(game.id) !== index
  //         ? { ...game, id: `${game.id}-${index}` }
  //         : game
  //     })

  //     // addAllAsync(games)
  //     setList(games)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [data])

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
