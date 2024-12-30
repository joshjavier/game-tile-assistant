import type { AppStore } from '../../app/store'
import { makeStore } from '../../app/store'
import type { ITile, TilesSliceState } from './tilesSlice'
import { tilesSlice, tileAdded, selectTiles } from './tilesSlice'

interface LocalTestContext {
  store: AppStore
}

describe<LocalTestContext>('tiles reducer', it => {
  beforeEach<LocalTestContext>(context => {
    const initialState: TilesSliceState = {
      tiles: [],
    }

    const store = makeStore({ tiles: initialState })

    context.store = store
  })

  it('should handle initial state', () => {
    expect(tilesSlice.reducer(undefined, { type: 'unknown' })).toStrictEqual({
      tiles: [],
    })
  })

  it('should handle tileAdded', ({ store }) => {
    expect(selectTiles(store.getState())).toHaveLength(0)

    const gameTile: ITile = {
      id: 'test',
      image: 'test',
      name: 'Test Game Tile',
      slug: 'test',
      smartlink: 'test',
    }

    store.dispatch(tileAdded(gameTile))

    expect(selectTiles(store.getState())).toHaveLength(1)
  })
})
