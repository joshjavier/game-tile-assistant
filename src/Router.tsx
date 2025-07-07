import { createBrowserRouter, redirect } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Root, RootBoundary } from './components/Root';
import { isValidLabel } from './lib/utils';
import { ErrorPage } from './pages/Error.page';
import { HomePage } from './pages/Home.page';

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
        ErrorBoundary: ErrorPage,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
