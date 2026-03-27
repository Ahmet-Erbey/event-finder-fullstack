import { Outlet } from '@tanstack/react-router';
import { Header } from '#/components/layout/header';
import { SearchProvider } from '#/context/search-context';

interface Props {
  children?: React.ReactNode;
}

export function AuthenticatedLayout({ children }: Props) {
  return (
    <SearchProvider>
      <div className="flex min-h-svh w-full flex-col bg-background">
        <Header />
        <main className="flex-1 overflow-x-hidden pt-4">
          {children ? children : <Outlet />}
        </main>
      </div>
    </SearchProvider>
  );
}
