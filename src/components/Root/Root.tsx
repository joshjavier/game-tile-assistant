import { Outlet } from 'react-router';
import { Container } from '@mantine/core';
import { Header } from '../Header';

export function Root() {
  return (
    <>
      <Header />
      <Container component="main">
        <Outlet />
      </Container>
    </>
  );
}
