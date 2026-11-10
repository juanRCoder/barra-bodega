import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useLogout } from '@/hooks/useAuthMutations';
import {
  Box,
  LayoutDashboard,
  UsersRound,
  X,
  ScanBarcode,
  Phone,
  LogOut,
  type LucideIcon,
  Menu,
} from 'lucide-react';

// --- Subcomponentes ---

const SectionLabel = ({ text }: { text: string }) => (
  <div className="text-[10.5px]/[normal] text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal tracking-[1.4px] text-left whitespace-nowrap py-2">
    {text}
  </div>
);

// Ahora NavItem recibe 'href' y verifica si es la ruta activa, ademas de recibir una función onNavigate para cerrar el menú
const NavItem = ({
  icon: Icon,
  label,
  href,
  onNavigate,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  onNavigate: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link
      to={href}
      onClick={onNavigate}
      className={`box-border w-full h-9 shrink-0 flex flex-row gap-3 p-[0px_12px] justify-start items-center rounded-[14px] transition-colors hover:bg-[#65736B]/5 ${
        isActive ? 'bg-[#EAF2DF]' : 'bg-transparent'
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#104B37]' : 'text-[#65736B]'}`}
        strokeWidth={1.8}
      />
      <div
        className={`text-[12.5px]/[normal] font-[Inter,system-ui,sans-serif] text-left whitespace-nowrap ${
          isActive ? 'text-[#104B37] font-bold' : 'text-[#65736B] font-medium'
        }`}
      >
        {label}
      </div>
    </Link>
  );
};

// --- Componente Principal ---

export const Sidebar = () => {
  const navigate = useNavigate();
  const { data: user } = useAuthSession();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Rutas de navegación principal
  const mainNav = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: UsersRound, label: 'Cuentas', href: '/accounts' },
    { icon: Box, label: 'Inventario', href: '/inventory' },
  ];

  // Rutas de atajos (puedes ajustar las rutas según tus necesidades)
  const shortcuts = [
    { icon: ScanBarcode, label: 'Nuevo pedido', href: '/scan/new-order' },
    // { icon: UserPlus, label: 'Nueva cuenta', href: '/accounts/new' },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-[9px] text-[#17221D] cursor-pointer"
      >
        <Menu />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        role="presentation"
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default"
        />

        {/* Drawer */}
        <aside
          aria-label="Menú principal"
          aria-modal="true"
          role="dialog"
          className={`box-border w-75.5 h-full [box-shadow:10px_0px_30px_#111C1740] absolute left-0 top-0 flex flex-col gap-4 p-[18px_14px] justify-between items-start bg-[#FFFFFF] rounded-[0px_24px_24px_0px] transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* --- SECCIÓN SUPERIOR --- */}
          <section className="flex-1 box-border w-full h-fit shrink-0 flex flex-col gap-3.5 justify-start items-start">
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-2.25 justify-start items-center">
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] bg-[#D9F36A]">
                  <span className="text-[20px] font-bold text-[#104B37]">
                    ▥
                  </span>
                </div>
                <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start">
                  <p className="text-[14.5px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.5px] text-left whitespace-nowrap">
                    BarraBodega
                  </p>
                  <p className="text-[9.5px]/[normal] text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    Bodega Doña Rosa
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setIsOpen(false)}
                className="box-border w-7.5 shrink-0 h-7.5 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] rounded-[10px] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="box-border w-full h-fit shrink-0 gap-1 flex flex-col justify-start items-start">
              <SectionLabel text="MENÚ" />
              {mainNav.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}

              <div className="box-border w-full h-px shrink-0 bg-[#E4E9DF]" />

              <SectionLabel text="ATAJOS" />
              {shortcuts.map((item) => (
                <NavItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </div>
          </section>

          {/* --- SECCIÓN INFERIOR --- */}
          <section className="box-border w-full h-fit shrink-0 flex flex-col justify-start items-start">
            <div className="box-border w-full h-px shrink-0 bg-[#E4E9DF]" />
            <SectionLabel text="SISTEMA" />

            <div className="pt-2 box-border w-full h-fit shrink-0 flex flex-row gap-2.5 pb-2 justify-start items-center">
              <div className="box-border w-8.5 shrink-0 h-8.5 flex flex-row gap-0 justify-center items-center bg-[#D9F36A] rounded-[17px]">
                <div className="text-[11.5px]/[normal] text-[#104B37] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                  {initials}
                </div>
              </div>
              <div className="box-border flex-[1_1_0] h-fit flex flex-col gap-0 justify-start items-start">
                <div className="text-[12.5px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                  {user?.name}
                </div>
                <div className="text-[10.5px]/[normal] text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                  {user?.businessName || user?.role}
                </div>
              </div>
            </div>

            <div className="box-border w-full h-9 shrink-0 flex flex-row gap-2.75 p-[0px_10px] justify-start items-center rounded-xl hover:bg-[#65736B]/10 cursor-pointer pb-1">
              <Phone
                className="h-4 w-4 shrink-0 text-[#65736B]"
                strokeWidth={1.8}
              />
              <div className="text-[11.5px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                Ayuda y soporte
              </div>
            </div>

            <button
              type="button"
              disabled={logout.isPending}
              onClick={() =>
                logout.mutate(undefined, {
                  onSuccess: () => navigate('/auth/login'),
                })
              }
              className="box-border w-full h-9 shrink-0 flex flex-row gap-2.75 p-[0px_10px] justify-start items-center rounded-[13px] hover:bg-[#65736B]/10 cursor-pointer pb-1 disabled:opacity-50"
            >
              <LogOut
                className="h-4 w-4 shrink-0 text-[#B5392B]"
                strokeWidth={1.8}
              />
              <div className="text-[11.5px]/[normal] text-[#B5392B] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
                Cerrar sesión
              </div>
            </button>
            {logout.error && (
              <p className="px-2 text-xs text-[#B5392B]" role="alert">
                {logout.error.message}
              </p>
            )}

            <div className="pt-2 text-[8px]/[normal] text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
              BarraBodega v1.0
            </div>
          </section>
        </aside>
      </div>
    </>
  );
};
