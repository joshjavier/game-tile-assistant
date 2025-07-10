import { delay, http, HttpResponse } from 'msw';
import { isValidLabel } from '@/lib/utils';
import games from './games.json';

export const handlers = [
  http.get('/hello', () => {
    return HttpResponse.json({
      message: 'hello',
    });
  }),

  http.get('/api/v1/games', async ({ request }) => {
    const url = new URL(request.url);

    const brand = url.searchParams.get('b');
    const state = url.searchParams.get('s');

    if (!brand || !state || !isValidLabel(brand, state)) {
      return HttpResponse.json({ error: 'Invalid label' }, { status: 404 });
    }

    await delay(3000); // Simulate real-world delay which takes about 3 seconds

    return HttpResponse.json(games);
  }),
];
