import { QueryClient, QueryClientProvider } from "react-query";

import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";

import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <AppRouter />
        </RecoilRoot>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
