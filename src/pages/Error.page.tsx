import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Center } from '@mantine/core';
import { NothingFoundBackground } from '@/components/NotFound';

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Center>
        <NothingFoundBackground />
      </Center>
    );
  }

  throw error;
}
