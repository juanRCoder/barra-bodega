import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthUser } from './src/hooks/useAuthUser';
import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';

const queryClient = new QueryClient();

function Root() {
  const { data: user } = useAuthUser();
  return user ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  );
}
