import { GameMetaData } from '../_types';
import { getCasinoBaseUrl } from '../_utils';

// Required config for a successful fetch from Bwin Games API
export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

/**
 * Returns a promise that resolves to the response from Bwin Games API
 * containing the games metadata for given label.
 */
function fetchGames(
  brand: string | null,
  state: string | null,
  { mobile = false } = {}
): Promise<Response> {
  const baseUrl = getCasinoBaseUrl(brand, state);
  const apiUrl = `${baseUrl}/en/games/api/content/GetGameMetaDataFromLMTAsync`;
  const request = new Request(apiUrl);

  // Since Single-Domain Migration, x-bwin-casino-api header needs to be set
  request.headers.set('X-Bwin-Casino-Api', 'prod');

  if (mobile) {
    request.headers.set(
      'User-Agent',
      'Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/114.0 Firefox/114.0'
    );
  }

  return fetch(request);
}

/**
 * Merges desktop and mobile game arrays into a single array
 * to keep data sent to the client as small as possible.
 */
function mergeGames(desktopGames: GameMetaData[], mobileGames: GameMetaData[]) {
  const desktopGameIds = desktopGames.map((item) => item.sid);
  const mobileOnly = mobileGames.filter((item) => !desktopGameIds.includes(item.sid));
  const mobileMap = new Map(mobileOnly.map((item) => [item.name, item]));

  return desktopGames.map((item) => {
    const game: Pick<GameMetaData, 'game' | 'name' | 'provider'> & { id: string; mobile?: string } =
      {
        id: item.sid.slice(4), // strip "/id/"
        name: item.name,
        provider: item.provider,
        game: item.game,
      };
    if (mobileMap.has(game.name)) {
      game.mobile = mobileMap.get(game.name)!.game;
    }
    return game;
  });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const brand = params.get('b');
  const state = params.get('s');

  try {
    const responses = await Promise.all([
      fetchGames(brand, state),
      fetchGames(brand, state, { mobile: true }),
    ]);

    if (!responses[0].ok) {
      return responses[0];
    }

    const [d, m]: GameMetaData[][] = await Promise.all(responses.map((r) => r.json()));
    const mergedGames = mergeGames(d, m);
    return Response.json(mergedGames);
  } catch (err) {
    console.log(err);

    if (err instanceof Error && err.message === 'Invalid label') {
      return Response.json({ error: err.message }, { status: 400 });
    }

    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
