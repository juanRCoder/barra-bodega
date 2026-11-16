import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './src/pages/Login';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Login />
    </QueryClientProvider>
  );
}
