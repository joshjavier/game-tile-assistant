import axios, { type AxiosResponse } from 'axios'
import { getCasinoBaseUrl } from './utils'

export interface GameMetaData {
  game: string
  name: string
  provider: string
  sid: string
  ownerId: string
}

// const instance = axios.create({
//   url: '/en/games/api/content/GetGameMetaDataFromLMTAsync',
// })

export async function getGamesByBrandState(
  brand?: string, state?: string
): Promise<AxiosResponse<GameMetaData[]>> {
  const baseURL = getCasinoBaseUrl(brand, state)
  return axios({
    baseURL,
    url: '/en/games/api/content/GetGameMetaDataFromLMTAsync',
  })
}
