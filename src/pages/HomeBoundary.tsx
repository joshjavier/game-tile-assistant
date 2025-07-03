import { isRouteErrorResponse, useRouteError } from 'react-router';

export function HomeBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>This brand/state doesn't exist!</div>;
  }

  throw error;
}
