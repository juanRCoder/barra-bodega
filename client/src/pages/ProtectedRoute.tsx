import { Navigate, useLocation } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { data: user, isPending, isError, refetch } = useAuthSession();

  if (isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm text-[#65736B]"
        role="status"
      >
        Verificando sesión...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-[#65736B]">
        <p role="alert">No se pudo verificar la sesión. Revisa tu conexión.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-full bg-[#176B4D] px-4 py-2 font-semibold text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
}
