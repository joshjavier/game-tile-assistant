import type { AppStore } from '../../app/store'
import { makeStore } from '../../app/store'
import type { ITile, TilesSliceState } from './tilesSlice'
import {
  tilesSlice,
  tileAdded,
  selectTiles,
  tileRemoved,
  tilesCleared,
} from './tilesSlice'

const gameTile: ITile = {
  id: 'test',
  image: 'test',
  name: 'Test Game Tile',
  slug: 'test',
  smartlink: 'test',
  provider: 'test',
}

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

    store.dispatch(tileAdded(gameTile))

    expect(selectTiles(store.getState())).toHaveLength(1)
  })

  it('should handle tileRemoved', ({ store }) => {
    store.dispatch(tileAdded(gameTile))
    store.dispatch(tileAdded({ ...gameTile, id: 'test-1' }))
    expect(selectTiles(store.getState())).toHaveLength(2)

    store.dispatch(tileRemoved('test'))

    expect(selectTiles(store.getState())).toHaveLength(1)
  })

  it('should handle tileCleared', ({ store }) => {
    store.dispatch(tileAdded(gameTile))
    store.dispatch(tileAdded({ ...gameTile, id: 'test-1' }))
    store.dispatch(tileAdded({ ...gameTile, id: 'test-2' }))
    expect(selectTiles(store.getState())).toHaveLength(3)

    store.dispatch(tilesCleared())

    expect(selectTiles(store.getState())).toHaveLength(0)
  })
})
