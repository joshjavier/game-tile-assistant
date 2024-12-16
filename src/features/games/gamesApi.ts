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
  const corsUrl = 'https://corsproxy.joshjavier12.workers.dev/corsproxy/?mobile&apiurl=' + url
  // const mobileUA = 'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0'

  const { data: desktopGameMetaData } = await axios.get<GameMetaData[]>(url)
  const { data: mobileGameMetaData } = await axios.get<GameMetaData[]>(corsUrl)

  const desktopGameIds = desktopGameMetaData.map(game => game.sid)
  const mobileOnly = mobileGameMetaData.filter(game => !desktopGameIds.includes(game.sid))
  // const dgcAndNetentGameMetaData = mobileGameMetaData.filter(({ provider }) => ['DGC', 'NETENT'].includes(provider))

  const itemToGame = ({ game, name, provider, sid }: GameMetaData): Game => ({
    id: sid.slice(4),
    game,
    name,
    provider,
  })

  return {
    desktop: desktopGameMetaData.map(itemToGame),
    mobile: mobileOnly.map(itemToGame),
  }
}
