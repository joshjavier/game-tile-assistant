import { createBrowserRouter, redirect } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Root, RootBoundary } from './components/Root';
import { isValidLabel } from './lib/utils';
import { HomePage } from './pages/Home.page';
import { HomeBoundary } from './pages/HomeBoundary';

const router = createBrowserRouter([
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
        },
        Component: HomePage,
        ErrorBoundary: HomeBoundary,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
