import { useMemo } from 'react';
import { createBrowserRouter, redirect } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Root, RootBoundary } from './components/Root';
import { isValidLabel } from './lib/utils';
import { ErrorPage } from './pages/Error.page';
import { HomePage } from './pages/Home.page';

export function Router() {
  const router = useMemo(() => {
    return createBrowserRouter([
      {
        path: '/',
        Component: Root,
        ErrorBoundary: RootBoundary,
        children: [
          { index: true, loader: () => redirect('betmgm/nj') },
          {
            path: ':brand/:state?',
            loader: ({ params: { brand, state } }) => {
              if (!isValidLabel(brand, state)) {
                throw new Response('Not Found', { status: 404 });
              }

              if (state === undefined) {
                return redirect('nj');
              }

              const games = fetch(`/api/v2/games?b=${brand}&s=${state}`).then((res) => res.json());

              return { games };
            },
            Component: HomePage,
            ErrorBoundary: ErrorPage,
          },
        ],
      },
    ]);
  }, []);

  return <RouterProvider router={router} />;
}
