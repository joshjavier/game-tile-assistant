import { Link } from 'react-router';
import { Anchor, Button, Center, Container, Group, Text, Title } from '@mantine/core';
import { Illustration } from './Illustration';
import classes from './NothingFoundBackground.module.css';

export function NothingFoundBackground() {
  return (
    <Center className={classes.root}>
      <Container>
        <div className={classes.inner}>
          <Illustration className={classes.image} />
          <div className={classes.content}>
            <Title className={classes.title}>Nothing to see here</Title>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
              The page you are trying to open does not exist. You may have mistyped the address, or
              the page has been moved to another URL. If you think this is an error,{' '}
              <Anchor
                href="https://github.com/joshjavier/game-tile-assistant/issues/new?template=bug_report.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                file a bug report
              </Anchor>
              .
            </Text>
            <Group justify="center">
              <Button size="md" component={Link} to="/">
                Back to the home page
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </Center>
  );
}
