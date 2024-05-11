import { QueryClient, QueryClientProvider } from "react-query";
import AuthProvider from "@/contexts/AuthContext";

import { HelmetProvider } from "react-helmet-async";
import usePersistCart from "@/hooks/usePersistCart";

import AppRouter from "@/routes/AppRouter";

const queryClient = new QueryClient();

const App = () => {
  usePersistCart();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
