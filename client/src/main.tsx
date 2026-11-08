import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainRouter } from '@/route.tsx';
import { AuthProvider } from '@/auth/AuthProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <MainRouter />
    </AuthProvider>
  </StrictMode>
);
