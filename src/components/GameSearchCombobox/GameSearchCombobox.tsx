import { memo, startTransition, useEffect, useMemo, useState } from 'react';
import createFuzzySearch, { FuzzyResult } from '@nozbe/microfuzz';
import { IconSearch } from '@tabler/icons-react';
import {
  Combobox,
  Loader,
  NumberFormatter,
  ScrollArea,
  Text,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { Game } from '@/lib/types';
import { Highlight } from './Highlight';
import classes from './GameSearchCombobox.module.css';

interface GameSearchComboboxProps {
  games: Game[];
}

const GameResult = memo(({ item, matches: [highlightRanges] }: FuzzyResult<Game>) => {
  return (
    <Combobox.Option value={item.name}>
      <Text fz="sm" fw={500}>
        <Highlight text={item.name} ranges={highlightRanges} />
      </Text>
      <Text fz="xs" opacity={0.6}>
        {item.provider}
      </Text>
    </Combobox.Option>
  );
});

const SearchResults = ({ data, total }: { data: FuzzyResult<Game>[] | null; total: number }) => {
  const results = (data || []).map((result) => <GameResult key={result.item.game} {...result} />);

  return (
    <Combobox.Options>
      <Combobox.Header>
        <Text fz="xs" c="dimmed">
          <NumberFormatter value={data?.length} thousandSeparator />{' '}
          {data?.length === 1 ? 'match' : 'matches'} out of{' '}
          <NumberFormatter value={total} thousandSeparator /> games
        </Text>
      </Combobox.Header>
      <ScrollArea.Autosize mah={400}>
        {results.length === 0 ? <Combobox.Empty>No results found</Combobox.Empty> : results}
      </ScrollArea.Autosize>
    </Combobox.Options>
  );
};

export function GameSearchCombobox({ games }: GameSearchComboboxProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FuzzyResult<Game>[] | null>(null);
  const [value, setValue] = useState('');
  const fuzzySearch = useMemo(() => createFuzzySearch(games, { key: 'name' }), [games]);

  useEffect(() => {
    // We need to wait for results to render before we can select the first one
    if (!loading && value.trim() !== '') {
      combobox.selectFirstOption();
    }
  }, [loading]);

  const fetchResults = async (query: string) => {
    if (query.trim() === '') {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    startTransition(() => {
      setData(fuzzySearch(query));
      setLoading(false);
    });
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
            combobox.openDropdown();
          }}
          onFocus={() => {
            combobox.openDropdown();
            combobox.selectFirstOption();
          }}
          onBlur={() => combobox.closeDropdown()}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <SearchResults data={data} total={games.length} />
      </Combobox.Dropdown>
    </Combobox>
  );
}
