import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Plus, ChevronRight } from 'lucide-react';

// --- Datos de prueba ---
const clientsData = [
  {
    id: '1',
    name: 'Rosa Pérez',
    phone: '987 654 321',
    initials: 'RP',
    amount: 'S/ 24.50',
    status: 'debt', // 'debt' | 'paid'
    avatarBg: 'bg-[#EAF2DF]',
    avatarText: 'text-[#104B37]',
  },
  {
    id: '2',
    name: 'Lucía Vargas',
    phone: '977 553 090',
    initials: 'LV',
    amount: 'S/ 0.00',
    status: 'paid',
    avatarBg: 'bg-[#F1F3EC]',
    avatarText: 'text-[#65736B]',
  },
  // Puedes agregar más clientes aquí
];

const filterOptions = ['Todos', 'Con deuda', 'Saldados'] as const;

// --- Subcomponente para la tarjeta del cliente ---
const ClientCard = ({ client }: { client: (typeof clientsData)[0] }) => {
  const isDebt = client.status === 'debt';

  return (
    <div className="box-border w-full shrink-0 flex flex-col gap-1.75 p-3.25 justify-start items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-2xl cursor-pointer hover:bg-[#F7F8F2] transition-colors">
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-center flex-wrap">
        <div
          className={`box-border w-8.5 shrink-0 h-8.5 flex flex-row gap-0 justify-center items-center rounded-full ${client.avatarBg}`}
        >
          <div
            className={`text-[9.5px]/[normal] box-border ${client.avatarText} font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap`}
          >
            {client.initials}
          </div>
        </div>
        <div className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start min-w-0">
          <div className="text-[12px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap truncate w-full">
            {client.name}
          </div>
          <div className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap truncate w-full">
            {client.phone}
          </div>
        </div>
        <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0.5 justify-start items-end">
          <div
            className={`text-[12.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap ${isDebt ? 'text-[#B5392B]' : 'text-[#176B4D]'}`}
          >
            {client.amount}
          </div>
          <div
            className={`box-border w-fit h-fit shrink-0 flex flex-row gap-0 px-1.75 py-0.5 justify-start items-center rounded-full ${isDebt ? 'bg-[#FBEAE6]' : 'bg-[#EAF2DF]'}`}
          >
            <div
              className={`text-[7.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap ${isDebt ? 'text-[#B5392B]' : 'text-[#104B37]'}`}
            >
              {isDebt ? 'Con deuda' : 'Saldado'}
            </div>
          </div>
        </div>
        <ChevronRight className="box-border size-3.25 shrink-0 text-[#65736B]" />
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function Accounts() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filterOptions)[number]>('Con deuda');

  // Lógica para filtrar los clientes (opcional, para que veas cómo se conectaría)
  const filteredClients = clientsData.filter((client) => {
    if (activeFilter === 'Con deuda') return client.status === 'debt';
    if (activeFilter === 'Saldados') return client.status === 'paid';
    return true; // 'Todos'
  });

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
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
                  3 clientes deben S/ 248.50
                </div>
              </div>
            </div>
            <button className="box-border w-fit shrink-0 h-8.5 flex flex-row gap-1.5 px-3.25 py-0 justify-start items-center bg-[#176B4D] rounded-full hover:bg-[#104B37] transition-colors cursor-pointer">
              <Plus className="box-border size-3.5 shrink-0 text-[#FFFFFF]" />
              <div className="text-[11px]/[normal] box-border text-[#FFFFFF] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                Nuevo
              </div>
            </button>
          </div>

          {/* Por cobrar */}
          <div className="box-border w-full shrink-0 flex flex-col gap-1.5 p-3.75 justify-start items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-[20px]">
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center">
              <div className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
                Total por cobrar
              </div>
              <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 px-2 py-0.75 justify-start items-center bg-[#FBEAE6] rounded-full">
                <div className="text-[8.5px]/[normal] box-border text-[#B5392B] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
                  3 con deuda
                </div>
              </div>
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-end flex-wrap">
              <div className="text-[27px]/[normal] box-border text-[#B5392B] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.2px] text-left whitespace-nowrap">
                S/ 248.50
              </div>
              <div className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                14 cuentas
              </div>
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start">
              <div className="box-border w-full h-1.75 shrink-0 flex flex-row gap-0.5 justify-start items-start bg-[#F1F4EC] rounded-full">
                <div className="box-border w-4/5 shrink-0 h-1.75 bg-[#176B4D] rounded-full"></div>
                <div className="box-border w-1/5 shrink-0 h-1.75 bg-[#B5392B] rounded-full"></div>
              </div>
              <div className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-start flex-wrap">
                <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.25 justify-start items-center">
                  <div className="box-border size-1.5 shrink-0 bg-[#176B4D] rounded-[3px]"></div>
                  <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    Cobrado S/ 612.00
                  </div>
                </div>
                <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.25 justify-start items-center">
                  <div className="box-border size-1.5 shrink-0 bg-[#B5392B] rounded-[3px]"></div>
                  <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    Pendiente S/ 248.50
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
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`box-border w-fit shrink-0 h-7.5 flex flex-row gap-0 px-3 py-0 justify-start items-center rounded-full border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#176B4D] border-[#176B4D]'
                      : 'bg-[#FFFFFF] border-[#E4E9DF] hover:bg-[#F7F8F2]'
                  }`}
                >
                  <div
                    className={`text-[10.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] text-left whitespace-nowrap ${
                      isActive
                        ? 'text-[#FFFFFF] font-bold'
                        : 'text-[#65736B] font-normal'
                    }`}
                  >
                    {filter}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lista de Clientes */}
          <div className="box-border w-full flex flex-col gap-2 justify-start items-start">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))
            ) : (
              <div className="w-full text-center text-[12px] text-[#65736B] py-4">
                No hay clientes para este filtro.
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
