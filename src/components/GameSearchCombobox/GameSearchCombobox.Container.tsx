import React from 'react';
import { Await, useLoaderData } from 'react-router';
import { Game } from '@/lib/types';
import { GameSearchCombobox } from './GameSearchCombobox';

export function GameSearchComboboxContainer() {
  const { games } = useLoaderData<{ games: Promise<{ d: Game[]; m: Game[] }> }>();

  return (
    <React.Suspense fallback={<>Loading games...</>}>
      <Await resolve={games} errorElement={<>Could not load games</>}>
        {(games) => <GameSearchCombobox games={games} />}
      </Await>
    </React.Suspense>
  );
}
