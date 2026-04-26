import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
// Generated Routes
import { AuthProvider } from '#/context/auth-context';
import { handleServerError } from '#/utils/handle-server-error';
import { FontProvider } from './context/font-context';
import { ThemeProvider } from './context/theme-context';
import './styles/index.css';
import { routeTree } from './routeTree.gen';
import type { RouterContext } from './types/router-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error });

        if (failureCount >= 0 && import.meta.env.DEV) return false;
        if (failureCount > 3 && import.meta.env.PROD) return false;

        return true;
      },
      //refetchOnWindowFocus: import.meta.env.PROD,
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error);
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // TODO: Backend hazır olduğunda aşağıdaki satırı aç:
      // toast.error('Something went wrong!');
      console.warn('[QueryCache] API error (backend may be unavailable):', error);
    },
  }),
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { 
    queryClient,
  } as RouterContext,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <FontProvider>
              <RouterProvider router={router} />
            </FontProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}
