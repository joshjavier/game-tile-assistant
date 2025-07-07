import { Link } from 'react-router';
import { Box, Group, VisuallyHidden } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle';
import { GameTilerLogo } from '../GameTilerLogo';
import { LabelPicker } from '../LabelPicker';
import classes from './Header.module.css';

export function Header() {
  return (
    <header className={classes.header}>
      <Group h="100%" justify="space-between">
        <Box component={Link} to="/" display="inline-flex">
          <GameTilerLogo height={30} />
          <VisuallyHidden>GameTiler Home</VisuallyHidden>
        </Box>
        <LabelPicker />
        <ColorSchemeToggle />
      </Group>
    </header>
  );
}
