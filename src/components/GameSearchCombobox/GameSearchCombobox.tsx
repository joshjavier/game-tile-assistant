import { memo, startTransition, useMemo, useState } from 'react';
import createFuzzySearch, { FuzzyResult } from '@nozbe/microfuzz';
import { IconSearch } from '@tabler/icons-react';
import { Combobox, Loader, Text, TextInput, useCombobox } from '@mantine/core';
import { Game } from '@/lib/types';
import { Highlight } from './Highlight';
import classes from './GameSearchCombobox.module.css';

interface GameSearchComboboxProps {
  games: { d: Game[]; m: Game[] };
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

const SearchResults = ({ data }: { data: FuzzyResult<Game>[] | null }) => {
  const results = (data || []).map((result) => <GameResult key={result.item.game} {...result} />);

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
  const [data, setData] = useState<FuzzyResult<Game>[] | null>(null);
  const [value, setValue] = useState('');
  const fuzzySearch = useMemo(() => createFuzzySearch(games.d, { key: 'name' }), [games.d]);

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
