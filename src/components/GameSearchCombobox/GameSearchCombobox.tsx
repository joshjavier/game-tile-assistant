import { memo, startTransition, useCallback, useRef, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { Combobox, Loader, Text, TextInput, useCombobox } from '@mantine/core';
import { Game } from '@/lib/types';
import classes from './GameSearchCombobox.module.css';

interface GameSearchComboboxProps {
  games: { d: Game[]; m: Game[] };
}

const GameResult = memo(({ name, provider }: Game) => {
  return (
    <Combobox.Option value={name}>
      <Text fz="sm" fw={500}>
        {name}
      </Text>
      <Text fz="xs" opacity={0.6}>
        {provider}
      </Text>
    </Combobox.Option>
  );
});

const SearchResults = ({ data }: { data: Game[] | null }) => {
  const results = (data || []).map((item) => <GameResult key={item.game} {...item} />);

  return (
    <Combobox.Options>
      {results.length === 0 ? <Combobox.Empty>No results found</Combobox.Empty> : results}
    </Combobox.Options>
  );
};

export function GameSearchCombobox({ games }: GameSearchComboboxProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Game[] | null>(null);
  const [value, setValue] = useState('');
  const abortController = useRef<AbortController | undefined>(null);

  // TODO: Replace this function with microfuzz
  const getAsyncData = useCallback((searchQuery: string, signal: AbortSignal): Promise<Game[]> => {
    return new Promise<Game[]>((resolve, reject) => {
      signal.addEventListener('abort', () => {
        reject(new Error('Request aborted'));
      });

      setTimeout(() => {
        resolve(
          games.d.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }, Math.random() * 1000);
    });
  }, []);

  const fetchResults = async (query: string) => {
    if (query.trim() === '') {
      setData(null);
      setLoading(false);
      return;
    }

    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    const result = await getAsyncData(query, abortController.current.signal);
    startTransition(() => {
      setData(result);
      setLoading(false);
    });
    abortController.current = undefined;
  };

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        // TODO: Add game to active list
        console.log(`${val} added to active list`);

        setValue('');
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <TextInput
          radius="xl"
          size="md"
          className={classes.searchbox}
          placeholder="Search games"
          leftSection={<IconSearch size={18} stroke={1.5} />}
          leftSectionPointerEvents="none"
          rightSection={loading && <Loader size={18} />}
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
            fetchResults(event.currentTarget.value);
            // combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <SearchResults data={data} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
