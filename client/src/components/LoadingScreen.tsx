type LoadingScreenProps = {
  message: string;
};

// Pantalla de carga con el logo de la app y una animación leve.
export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-[#65736B]"
      role="status"
      aria-live="polite"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="flex size-14 animate-pulse items-center justify-center rounded-2xl bg-[#D9F36A] animation-duration-[1.8s]">
        <span
          aria-hidden="true"
          className="text-[34px] leading-none font-bold text-[#104B37]"
        >
          ▥
        </span>
      </div>
      <p className="m-0 animate-pulse text-sm animation-duration-[1.8s]">
        {message}
      </p>
    </div>
  );
}
