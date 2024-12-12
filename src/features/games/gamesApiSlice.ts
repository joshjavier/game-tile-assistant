import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface GameMetaData {
  game: string
  name: string
  provider: string
  sid: string
  ownerId: string
}

export const gamesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://casino.nj.betmgm.com/en/games/api/content/GetGameMetaDataFromLMTAsync' }),
  reducerPath: 'gamesApi',
  tagTypes: ['Game'],
  endpoints(build) {
    return {
      getGames: build.query<GameMetaData[], void>({
        query: () => '/'
      }),
    }
  },
})

export const { useGetGamesQuery } = gamesApiSlice
