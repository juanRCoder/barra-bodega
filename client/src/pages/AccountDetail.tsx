import { RegisterPayment } from '@/components/RegisterPayment';
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Layers,
  Phone,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccount } from '@/hooks/useAccounts';
import { AccountsApiError } from '@/services/accounts.service';
import type { AccountMovement } from '@/types/account.type';

const TABS = [
  { id: 'all' as const, label: 'Todo', Icon: Layers },
  { id: 'order' as const, label: 'Pedidos', Icon: ShoppingBag },
  { id: 'payment' as const, label: 'Pagos', Icon: Banknote },
];

const ITEMS_PER_PAGE = 4;
type MovementType = AccountMovement['type'];
const formatAmount = (amount: number) => {
  const sign = amount >= 0 ? '+' : '−';
  return `${sign} S/ ${Math.abs(amount).toFixed(2)}`;
};

const formatPhone = (phone: string) =>
  /^\d{9}$/.test(phone)
    ? phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
    : phone;

const formatMovementDate = (date: string) =>
  new Date(date).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function AccountDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const accountQuery = useAccount(id);
  const account = accountQuery.data;

  const [activeTab, setActiveTab] = useState<'all' | MovementType>('all');
  const [page, setPage] = useState(1);

  const filteredMovements = useMemo(() => {
    const movements = account?.movements ?? [];
    const filtered =
      activeTab === 'all'
        ? movements
        : movements.filter((movement) => movement.type === activeTab);

    return filtered.map((movement) => ({
      ...movement,
      amount: movement.type === 'payment' ? -movement.amount : movement.amount,
    }));
  }, [account?.movements, activeTab]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovements.length / ITEMS_PER_PAGE)
  );

  const visibleMovements = useMemo(
    () =>
      filteredMovements.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      ),
    [filteredMovements, page]
  );

  const handleTabChange = (tab: 'all' | MovementType) => {
    setActiveTab(tab);
    setPage(1);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (accountQuery.isPending) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm text-[#65736B]"
        role="status"
      >
        Cargando cuenta…
      </div>
    );
  }

  if (accountQuery.isError || !account) {
    const message =
      accountQuery.error instanceof AccountsApiError
        ? accountQuery.error.message
        : 'No se pudo cargar la cuenta.';

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-sm text-[#65736B]">
        <p role="alert">{message}</p>
        <button
          type="button"
          onClick={() => navigate('/accounts')}
          className="cursor-pointer rounded-full bg-[#176B4D] px-4 py-2 font-semibold text-white"
        >
          Volver a cuentas
        </button>
      </div>
    );
  }

  const initials = account.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const hasDebt = account.debt > 0;

  return (
    <div
      className="flex w-full justify-center text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        {/* Top Bar */}
        <div
          data-pencil-name="Top Bar"
          className="box-border w-full h-13.5 shrink-0 flex flex-row gap-0 justify-between items-center"
        >
          <div
            data-pencil-name="Left"
            className="box-border w-fit shrink-0 h-fit flex flex-row gap-2.5 justify-start items-center"
          >
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate('/accounts')}
              data-pencil-name="Back"
              className="box-border size-8 shrink-0 flex flex-row gap-0 justify-center items-center bg-white outline outline-[#E4E9DF] -outline-offset-0.5 rounded-2xl cursor-pointer"
            >
              <ChevronLeft className="box-border size-4 shrink-0 text-[#104B37]" />
            </button>
            <div
              data-pencil-name="Title"
              className="box-border w-fit shrink-0 h-fit flex flex-col gap-0 justify-start items-start"
            >
              <div
                data-pencil-name="Name"
                className="text-[15px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-extrabold tracking-[-0.4px] text-left whitespace-nowrap"
              >
                {account.name}
              </div>
              <div
                data-pencil-name="Sub"
                className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                Cuenta desde{' '}
                {new Date(account.createdAt).toLocaleDateString('es-PE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          data-pencil-name="Content"
          className="box-border w-full flex-1 flex flex-col gap-2.5 justify-start items-start"
        >
          {/* Profile */}
          <div
            data-pencil-name="Profile"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-2.5 p-3.5 justify-start items-start bg-white outline outline-[#E4E9DF] -outline-offset-0.5 rounded-[20px]"
          >
            <div
              data-pencil-name="Top"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-center"
            >
              <div
                data-pencil-name="Avatar"
                className={`box-border size-10.5 shrink-0 flex flex-row gap-0 justify-center items-center rounded-full ${hasDebt ? 'bg-[#EAF2DF]' : 'bg-[#F1F3EC]'}`}
              >
                <div
                  data-pencil-name="Initials"
                  className={`text-[12px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-extrabold text-left whitespace-nowrap ${hasDebt ? 'text-[#104B37]' : 'text-[#65736B]'}`}
                >
                  {initials}
                </div>
              </div>
              <div
                data-pencil-name="Identity"
                className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start"
              >
                <div
                  data-pencil-name="Name"
                  className="text-[14px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.3px] text-left whitespace-nowrap"
                >
                  {account.name}
                </div>
                <div
                  data-pencil-name="Phone Row"
                  className="box-border w-fit h-fit shrink-0 flex flex-row gap-1.25 justify-start items-center"
                >
                  <Phone className="box-border size-2.5 shrink-0 text-[#65736B]" />
                  <div
                    data-pencil-name="Phone"
                    className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
                  >
                    {formatPhone(account.phone)}
                  </div>
                </div>
              </div>
              <div
                data-pencil-name="Badge"
                className={`box-border w-fit shrink-0 h-fit flex flex-row gap-0 px-2 py-0.75 justify-start items-center rounded-full ${hasDebt ? 'bg-[#FBEAE6]' : 'bg-[#EAF2DF]'}`}
              >
                <div
                  data-pencil-name="Text"
                  className={`text-[8px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap ${hasDebt ? 'text-[#B5392B]' : 'text-[#104B37]'}`}
                >
                  {hasDebt ? 'Con deuda' : 'Saldado'}
                </div>
              </div>
            </div>

            <div
              data-pencil-name="Divider"
              className="box-border w-full h-px shrink-0 flex flex-row gap-0 justify-start items-start bg-[#E4E9DF]"
            />

            <div
              data-pencil-name="Saldo"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end"
            >
              <div
                data-pencil-name="Label Wrap"
                className="box-border w-fit shrink-0 h-fit flex flex-col gap-px justify-center items-center"
              >
                <div
                  data-pencil-name="Label"
                  className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
                >
                  Saldo pendiente
                </div>
                <div
                  data-pencil-name="Value"
                  className={`text-[27px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.2px] text-left whitespace-nowrap ${hasDebt ? 'text-[#B5392B]' : 'text-[#176B4D]'}`}
                >
                  S/ {account.debt.toFixed(2)}
                </div>
              </div>
            </div>

            <div
              data-pencil-name="Buttons"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-1.75 justify-start items-start flex-wrap"
            >
              <RegisterPayment
                accountId={account.id}
                accountName={account.name}
                balance={account.debt}
              />
              <button
                type="button"
                data-pencil-name="Add Product"
                onClick={() =>
                  navigate('/scan/new-order', {
                    state: { accountId: account.id },
                  })
                }
                className="box-border flex-1 h-10 flex flex-row gap-1.5 justify-center items-center bg-white outline outline-[#E4E9DF] -outline-offset-0.5 rounded-full cursor-pointer hover:bg-[#F7F8F2] transition-colors"
              >
                <Plus className="box-border size-3.5 shrink-0 text-[#176B4D]" />
                <div
                  data-pencil-name="Label"
                  className="text-[11px]/[normal] box-border text-[#104B37] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
                >
                  Agregar pedido
                </div>
              </button>
            </div>
          </div>

          {/* History */}
          <div
            data-pencil-name="History"
            className="box-border w-full shrink-0 flex flex-col gap-0 p-3.5 justify-start items-start bg-white outline outline-[#E4E9DF] -outline-offset-0.5 rounded-[20px] overflow-hidden"
          >
            {/* Header */}
            <div
              data-pencil-name="Header"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-0 pb-2 justify-between items-center"
            >
              <div className="text-[12px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                Historial de la cuenta
              </div>
              <div
                data-pencil-name="Chip"
                className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 px-2 py-0.75 justify-start items-center bg-[#F7F8F2] outline outline-[#E4E9DF] -outline-offset-0.5 rounded-full"
              >
                <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                  {filteredMovements.length} movimientos
                </div>
              </div>
            </div>

            {/* Filters */}
            <div
              data-pencil-name="Filters"
              className="box-border w-full h-10 shrink-0 flex flex-row gap-1 p-0.75 justify-start items-start bg-[#F7F8F2] rounded-full mb-2"
            >
              {TABS.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTabChange(id)}
                    data-pencil-name={`Tab ${label}`}
                    aria-pressed={isActive}
                    className={`box-border flex-1 h-full flex flex-row gap-1 justify-center items-center rounded-full cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#104B37]'
                        : 'bg-transparent hover:bg-[#E4E9DF]/40'
                    }`}
                  >
                    <Icon
                      className={`size-2.75 ${isActive ? 'text-[#D9F36A]' : 'text-[#65736B]'}`}
                    />
                    <div
                      className={`text-[9.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap ${
                        isActive ? 'text-[#FFFFFF]' : 'text-[#65736B]'
                      }`}
                    >
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Entries */}
            {visibleMovements.length === 0 ? (
              <div className="box-border w-full flex-1 flex items-center justify-center text-[10px]/[normal] text-[#65736B] font-[Inter,system-ui,sans-serif]">
                Sin movimientos
              </div>
            ) : (
              visibleMovements.map((m) => {
                const isPayment = m.type === 'payment';
                const Icon = isPayment ? Banknote : ShoppingBag;
                return (
                  <div
                    key={m.id}
                    data-pencil-name={`Entry ${m.date}`}
                    className="box-content w-full flex flex-row gap-2.25 py-3.25 justify-start items-center border-b border-solid border-[#E4E9DF] mb-[0.5px]"
                  >
                    {/* Icon tile */}
                    <div
                      data-pencil-name="Icon Tile"
                      className={`box-border size-7.5 shrink-0 flex flex-row gap-0 justify-center items-center rounded-xl ${
                        isPayment ? 'bg-[#EAF2DF]' : 'bg-[#FBEAE6]'
                      }`}
                    >
                      <Icon
                        className={`box-border size-3.5 shrink-0 ${
                          isPayment ? 'text-[#176B4D]' : 'text-[#B5392B]'
                        }`}
                      />
                    </div>

                    {/* Text */}
                    <div className="box-border flex-1 min-w-0 h-fit flex flex-col gap-px justify-start items-start">
                      {isPayment ? (
                        <div className="text-[10.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                          Pago registrado
                        </div>
                      ) : (
                        (m.items ?? ['Pedido']).map((item, i) => (
                          <div
                            key={i}
                            className="text-[10.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
                          >
                            {item}
                          </div>
                        ))
                      )}
                      <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                        {formatMovementDate(m.date)}
                        {m.status && m.status !== 'PAID'
                          ? ` · ${m.status === 'PENDING' ? 'Pendiente' : 'Anulado'}`
                          : ''}
                      </div>
                    </div>

                    {/* Amount */}
                    <div
                      className={`text-[10.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap shrink-0 ${
                        isPayment ? 'text-[#176B4D]' : 'text-[#17221D]'
                      }`}
                    >
                      {formatAmount(m.amount)}
                    </div>
                  </div>
                );
              })
            )}

            {/* Pager */}
            <div
              data-pencil-name="Pager"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-2 pt-2.5 justify-between items-center mt-auto"
            >
              <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                {visibleMovements.length} de {filteredMovements.length}{' '}
                movimientos
              </div>
              <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={page === 1}
                  aria-label="Página anterior"
                  className="box-border size-6 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] outline outline-[#E4E9DF] -outline-offset-0.5 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="box-border size-3 shrink-0 text-[#65736B]" />
                </button>
                <div className="text-[8.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
                  {page} / {totalPages}
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={page === totalPages}
                  aria-label="Página siguiente"
                  className="box-border size-6 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#17221D] rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="box-border size-3 shrink-0 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
