import { Link } from 'react-router';
import { Box, Group, VisuallyHidden } from '@mantine/core';
import { GameTilerLogo } from '../GameTilerLogo';
import classes from './Header.module.css';

export function Header() {
  return (
    <header className={classes.header}>
      <Group h="100%">
        <Box component={Link} to="/" display="inline-flex">
          <GameTilerLogo height={30} />
          <VisuallyHidden>GameTiler Home</VisuallyHidden>
        </Box>
      </Group>
    </header>
  );
}
