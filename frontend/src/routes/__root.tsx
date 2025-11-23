import { Toaster } from "sonner";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      retry: 0,
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <>
      <QueryClientProvider client={queryClient}>
        <OutletWrapper />
      </QueryClientProvider>
    </>
  ),
});

export const OutletWrapper = () => (
  <>
    <Header />
    <Outlet />
    <Toaster position="bottom-center" richColors />

    {/* <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
  </>
);
