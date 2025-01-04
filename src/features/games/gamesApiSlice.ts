import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Game } from './gamesApi'

export const gamesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/games' }),
  reducerPath: 'gamesApi',
  tagTypes: ['Games'],
  keepUnusedDataFor: 60 * 5, // keep cached data for 5 minutes

  endpoints(build) {
    return {
      getGames: build.query<
        Record<'d' | 'm', Game[]>,
        { brand?: string; state?: string }
      >({
        query({ brand, state }) {
          return `/${brand}/${state}`
        },
        providesTags(result, error, arg, meta) {
          return [{ type: 'Games', id: `${arg.brand}_${arg.state}` }]
        },
      }),
    }
  },
})

export const { useGetGamesQuery } = gamesApiSlice
