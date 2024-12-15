import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getGamesByBrandState, type GameMetaData } from "./gamesApi"
import { isAxiosError } from "axios"

type Game = Pick<GameMetaData, 'game' | 'name' | 'provider'> & { id: string }

export const gamesApiSlice = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl: 'https://casino.nj.betmgm.com/en/games/api/content/GetGameMetaDataFromLMTAsync' }),
  baseQuery: fetchBaseQuery({}),
  reducerPath: 'gamesApi',
  tagTypes: ['Games'],
  // keepUnusedDataFor: 5, // how long should we keep the fetched games data? maybe 5 mins is good enough...

  endpoints(build) {
    return {
      getGames: build.query<Game[], { brand?: string, state?: string }>({
        providesTags(result, error, arg, meta) {
          return [{ type: 'Games', id: `${arg.brand}_${arg.state}` }]
        },
        queryFn: async (arg, api, extraOptions, baseQuery) => {
          try {
            const games = await getGamesByBrandState(arg.brand, arg.state)
            const data: Game[] = games.data.map(
              ({ game, name, provider, sid }) => ({
                id: sid.slice(4),
                game,
                name,
                provider,
              })
            )
            return { data }
          } catch (err) {
            if (isAxiosError(err)) {
              return {
                error: {
                  status: err.response?.status,
                  data: err.response?.data || err.message,
                }
              }
            }

            console.log(err)

            return {
              error: {
                status: 'CUSTOM_ERROR',
                data: 'Unknown error',
              }
            }
          }
        },
      }),
    }
  },
})

export const { useGetGamesQuery } = gamesApiSlice
