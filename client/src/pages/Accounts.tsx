import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ClientCard } from '@/components/ClientCard';
import { NewAccount } from '@/components/NewAccount';
import { useAccounts } from '@/hooks/useAccounts';
import { AccountsApiError } from '@/services/accounts.service';
import { Button } from '@/components/ui/button';

const filterOptions = ['Todos', 'Con deuda', 'Saldados'] as const;

const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

export default function Accounts() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>('Todos');
  const accountsQuery = useAccounts();
  const accounts = accountsQuery.data?.accounts ?? [];
  const summary = accountsQuery.data?.summary;

  const filteredAccounts = accounts.filter((account) => {
    if (activeFilter === 'Con deuda') return account.debt > 0;
    if (activeFilter === 'Saldados') return account.debt <= 0;
    return true;
  });
  const totalTracked = (summary?.totalPaid ?? 0) + (summary?.totalDebt ?? 0);
  const collectedPercent =
    totalTracked > 0
      ? Math.min(
          100,
          Math.max(0, ((summary?.totalPaid ?? 0) / totalTracked) * 100)
        )
      : 0;

  return (
    <div
      className="flex w-full justify-center text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 px-3 pt-3 text-left">
        <section className="box-border w-full flex-1 flex flex-col gap-3 justify-start items-start">
          {/* Top Bar */}
          <div className="box-border w-full min-h-11 shrink-0 flex flex-wrap gap-3 justify-between items-center">
            <div className="box-border flex flex-row gap-2.5 justify-start items-center min-w-0 flex-1">
              <Sidebar />
              <div className="box-border w-fit h-fit flex flex-col gap-px justify-start items-start min-w-0">
                <div className="text-[23px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.1px] text-left truncate w-full">
                  Cuentas
                </div>
                <div className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left truncate w-full">
                  {accountsQuery.isPending
                    ? 'Cargando cuentas…'
                    : `${summary?.debtCount ?? 0} clientes deben ${formatCurrency(summary?.totalDebt ?? 0)}`}
                </div>
              </div>
            </div>
            <NewAccount />
          </div>

          {/* Por cobrar */}
          <div className="box-border w-full shrink-0 flex flex-col gap-1.5 p-3.75 justify-start items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-[20px]">
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                Total por cobrar
              </div>
              <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 px-2 py-0.75 justify-start items-center bg-[#FBEAE6] rounded-full">
                <div className="text-[8.5px]/[normal] box-border text-[#B5392B] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
                  {summary?.debtCount ?? 0} con deuda
                </div>
              </div>
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end flex-wrap">
              <div
                className={`text-[27px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.2px] text-left whitespace-nowrap ${
                  (summary?.totalDebt ?? 0) === 0
                    ? 'text-[#176B4D]'
                    : 'text-[#B5392B]'
                }`}
              >
                {formatCurrency(summary?.totalDebt ?? 0)}
              </div>
              <div className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                {summary?.accountCount ?? 0} cuentas
              </div>
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start">
              <div className="box-border w-full h-1.75 shrink-0 flex flex-row justify-start items-start bg-[#F1F4EC] rounded-full">
                <div
                  className="h-1.75 shrink-0 bg-[#176B4D] rounded-full"
                  style={{ width: `${collectedPercent}%` }}
                />
                <div
                  className="h-1.75 shrink-0 bg-[#B5392B] rounded-full"
                  style={{ width: `${100 - collectedPercent}%` }}
                />
              </div>
              <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start flex-wrap">
                <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.25 justify-start items-center">
                  <div className="box-border size-1.5 shrink-0 bg-[#176B4D] rounded-[3px]"></div>
                  <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    Cobrado {formatCurrency(summary?.totalPaid ?? 0)}
                  </div>
                </div>
                <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.25 justify-start items-center">
                  <div className="box-border size-1.5 shrink-0 bg-[#B5392B] rounded-[3px]"></div>
                  <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    Pendiente {formatCurrency(summary?.totalDebt ?? 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros Dinámicos */}
          <div className="box-border w-full shrink-0 flex flex-row gap-1.75 justify-start items-start flex-wrap">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <Button
                  key={filter}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={`cursor-pointer h-7.5 w-fit shrink-0 rounded-full border px-3 transition-colors text-[10.5px]/[normal] ${
                    isActive
                      ? 'border-[#176B4D] bg-[#176B4D] text-white hover:bg-[#104B37] hover:text-white'
                      : 'border-[#E4E9DF] bg-white text-[#65736B] hover:bg-[#F7F8F2] hover:text-[#65736B]'
                  }`}
                >
                  <span className={isActive ? 'font-bold' : 'font-normal'}>
                    {filter}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Lista de Clientes */}
          <div className="box-border w-full flex flex-col gap-2 justify-start items-start">
            {accountsQuery.isPending ? (
              <div
                className="w-full py-4 text-center text-[12px] text-[#65736B]"
                role="status"
              >
                Cargando cuentas…
              </div>
            ) : accountsQuery.isError ? (
              <div className="flex w-full flex-col items-center gap-2 py-4 text-center text-[12px] text-[#B5392B]">
                <p role="alert">
                  {accountsQuery.error instanceof AccountsApiError
                    ? accountsQuery.error.message
                    : 'No se pudieron cargar las cuentas.'}
                </p>
                <button
                  type="button"
                  onClick={() => void accountsQuery.refetch()}
                  className="cursor-pointer rounded-full bg-[#176B4D] px-4 py-2 font-semibold text-white"
                >
                  Reintentar
                </button>
              </div>
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <ClientCard key={account.id} account={account} />
              ))
            ) : (
              <div className="w-full text-center text-[12px] text-[#65736B] py-4">
                No hay cuentas para este filtro.
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
