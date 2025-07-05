import { IconMoon, IconSun } from '@tabler/icons-react';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './ColorSchemeToggle.module.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      radius="md"
      aria-label="Toggle color scheme"
    >
      <IconSun className={classes.light} size={22} stroke={1.5} aria-hidden="true" />
      <IconMoon className={classes.dark} size={22} stroke={1.5} aria-hidden="true" />
    </ActionIcon>
  );
}
