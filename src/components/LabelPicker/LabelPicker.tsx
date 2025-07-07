import { IconChevronDown } from '@tabler/icons-react';
import { useNavigate, useParams } from 'react-router';
import { CheckIcon, Combobox, Group, Image, UnstyledButton, useCombobox } from '@mantine/core';
import images from './images';
import classes from './LabelPicker.module.css';

interface Item {
  value: string;
  label: string;
  image: string;
}

const data: Item[] = [
  { value: 'betmgm:nj', label: 'BetMGM NJ', image: images.betmgm },
  { value: 'betmgm:mi', label: 'BetMGM MI', image: images.betmgm },
  { value: 'betmgm:pa', label: 'BetMGM PA', image: images.betmgm },
  { value: 'betmgm:wv', label: 'BetMGM WV', image: images.betmgm },
  { value: 'betmgm:on', label: 'BetMGM ON', image: images.betmgm },
  { value: 'borgata:nj', label: 'Borgata NJ', image: images.borgata },
  { value: 'borgata:pa', label: 'Borgata PA', image: images.borgata },
  { value: 'partycasino:nj', label: 'PartyCasino', image: images.partycasino },
  { value: 'wof:nj', label: 'Wheel of Fortune NJ', image: images.wof },
  { value: 'wof:on', label: 'Wheel of Fortune ON', image: images.wof },
];

function SelectOption({ label, image, isActive }: Item & { isActive: boolean }) {
  return (
    <Group gap="xs">
      <Image src={image} w={18} h={18} radius={999} alt="" />
      <span className={classes.label}>{label}</span>
      {isActive && <CheckIcon size={12} />}
    </Group>
  );
}

export function LabelPicker() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const navigate = useNavigate();
  const { brand, state } = useParams();

  const value = `${brand}:${state}`;
  const selectedOption = data.find((item) => item.value === value);

  const options = data.map((item) => (
    <Combobox.Option
      value={item.value}
      key={item.value}
      active={item.value === value}
      aria-selected={item.value === value}
    >
      <SelectOption {...item} isActive={item.value === value} />
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      width={220}
      onOptionSubmit={(val) => {
        navigate(`/${val.split(':').join('/')}`, { replace: true });
        combobox.closeDropdown();
      }}
      classNames={{ option: classes.option }}
    >
      <Combobox.Target>
        <UnstyledButton className={classes.control} onClick={() => combobox.toggleDropdown()}>
          {selectedOption ? (
            <Group gap="xs">
              <Image src={selectedOption.image} w={22} h={22} radius={999} alt="" />
              <span className={classes.label}>{selectedOption.label}</span>
            </Group>
          ) : (
            <span className={classes.placeholder}>Pick a label</span>
          )}
          <IconChevronDown size={16} className={classes.icon} aria-hidden="true" />
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
