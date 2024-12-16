import axios from 'axios'
import { getCasinoBaseUrl } from './utils'

export interface GameMetaData {
  game: string
  name: string
  provider: string
  sid: string
  ownerId: string
}

export type Game = Pick<GameMetaData, 'game' | 'name' | 'provider'> & { id: string }

export async function getGamesByBrandState(
  brand?: string, state?: string
): Promise<{ desktop: Game[], mobile: Game[] }> {
  const baseURL = getCasinoBaseUrl(brand, state)
  const url = baseURL + '/en/games/api/content/GetGameMetaDataFromLMTAsync'
  const mobileUA = 'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0'

  const { data: desktopGameMetaData } = await axios.get<GameMetaData[]>(url)
  const { data: mobileGameMetaData } = await axios.get<GameMetaData[]>(url, {
    headers: { 'User-Agent': mobileUA },
  })

  const dgcAndNetentGameMetaData = mobileGameMetaData.filter(({ provider }) => provider === 'DGC' || provider === 'NETENT')

  const itemToGame = ({ game, name, provider, sid }: GameMetaData): Game => ({
    id: sid.slice(4),
    game,
    name,
    provider,
  })

  return {
    desktop: desktopGameMetaData.map(itemToGame),
    mobile: dgcAndNetentGameMetaData.map(itemToGame),
  }
}
