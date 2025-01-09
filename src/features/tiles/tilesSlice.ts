import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk, RootState } from '../../app/store'
import type { Game } from '../games/gamesApi'
import { getCasinoBaseUrl } from '../games/utils'

export interface ITile {
  id: string
  name: string
  slug: string
  mobile?: string
  smartlink: string
  image: string
  provider: string
}

function gameToTile(game: [Game, Game?], brand = '', state = ''): ITile {
  const { id, name, provider, game: slug } = game[0]
  const image = `${getCasinoBaseUrl(brand, state, { gameSubdomain: true })}/htmllobby/images/newlmticons/square/${slug}.jpg`
  const mobile = game[1] ? game[1].game : undefined
  const smartlink = game[1]
    ? `!!M2.Promo/launchmgc?gd=${slug}&gm=${mobile}`
    : `!!M2.CasinoHome/launchng/${slug}`

  return { id, name, provider, slug, mobile, smartlink, image }
}

export interface TilesSliceState {
  tiles: ITile[]
}

const initialState: TilesSliceState = {
  tiles: [],
}

export const tilesSlice = createSlice({
  name: 'tiles',
  initialState,
  reducers: {
    tileAdded: (state, action: PayloadAction<ITile>) => {
      state.tiles.push(action.payload)
    },
    tileRemoved: (state, action: PayloadAction<string>) => {
      state.tiles = state.tiles.filter(({ id }) => id !== action.payload)
    },
    tilesCleared: state => {
      state.tiles = []
    },
  },
})

export const { tileAdded, tileRemoved, tilesCleared } = tilesSlice.actions
export default tilesSlice.reducer

export const selectTiles = (state: RootState) => state.tiles.tiles

export const addGameTile =
  (
    game: Game,
    { brand, state }: { brand?: string; state?: string },
  ): AppThunk =>
  (dispatch, getState) => {
    const cachedQueries = getState().gamesApi.queries
    const cacheKey = `getGames(${JSON.stringify({ brand, state })})`
    const mobileGames: Game[] = (cachedQueries[cacheKey]?.data as any).m
    const mobileVariant = mobileGames.find(g => g.name === game.name)
    const gameTile = gameToTile([game, mobileVariant], brand, state)
    dispatch(tileAdded(gameTile))
  }
