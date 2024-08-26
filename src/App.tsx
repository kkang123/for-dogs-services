import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "@/contexts/AuthContext";

import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";

import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </RecoilRoot>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
