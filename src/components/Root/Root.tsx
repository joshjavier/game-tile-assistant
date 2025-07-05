import { Outlet } from 'react-router';
import { Header } from '../Header';

export function Root() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
