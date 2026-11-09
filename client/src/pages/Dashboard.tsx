import { Sidebar } from '@/components/Sidebar';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Button } from '@/components/ui/button';

const currentDate = new Intl.DateTimeFormat('es-PE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

// const hourlySales = [
//   { hour: '08', value: 42, height: 35 },
//   { hour: '10', value: 68, height: 50 },
//   { hour: '12', value: 96, height: 66 },
//   { hour: '14', value: 74, height: 53 },
//   { hour: '16', value: 58, height: 44 },
//   { hour: '18', value: 88, height: 61 },
//   { hour: '20', value: 120, height: 80, highlight: true },
//   { hour: '22', value: 64, height: 47 }, a
// ];

export default function Dashboard() {
  const { data: user } = useAuthSession();
  const ranges = ['Hoy', 'Semana', 'Mes'] as const;
  type Range = (typeof ranges)[number];
  const [activeRange, setActiveRange] = useState<Range>('Hoy');

  const initials = user?.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        <div
          data-pencil-name="Top Bar"
          className="box-border flex h-8 w-full shrink-0 items-center justify-between"
        >
          <div className="flex items-center gap-2.25">
            <Sidebar />
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] bg-[#D9F36A]">
              <span className="text-[20px] font-bold text-[#104B37]">▥</span>
            </div>
            <div
              data-pencil-name="Name"
              className="whitespace-nowrap text-left text-[14.5px]/[normal] font-normal tracking-[-0.5px] text-[#17221D]"
            >
              BarraBodega
            </div>
          </div>
        </div>
        <div
          data-pencil-name="Greeting"
          className="box-border flex h-11.5 w-full shrink-0 items-center justify-between"
        >
          <div
            data-pencil-name="Text"
            className="box-border flex h-fit w-fit shrink-0 flex-col items-start justify-start gap-0.5"
          >
            <div
              data-pencil-name="Title"
              className="whitespace-nowrap text-left text-[23px]/[normal] font-normal tracking-[-1.1px] text-[#17221D]"
            >
              {user?.businessName || 'Mi negocio'}
            </div>
            <div
              data-pencil-name="Sub"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-normal text-[#65736B]"
            >
              {currentDate}
            </div>
          </div>
          <div
            data-pencil-name="Avatar"
            className="box-border flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2DF]"
          >
            <div
              data-pencil-name="Initials"
              className="whitespace-nowrap text-left text-[10px]/[normal] font-normal text-[#104B37]"
            >
              {initials}
            </div>
          </div>
        </div>

        {/* 3. Selector de Rango Dinámico */}
        <div
          data-pencil-name="Range"
          className="box-border flex h-9.5 w-full shrink-0 items-center justify-start gap-0.75 rounded-full border border-[#E4E9DF] bg-white p-1"
        >
          {ranges.map((range) => {
            const isActive = activeRange === range;

            return (
              <button
                key={range}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveRange(range)}
                className={`box-border flex h-7.5 flex-1 items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#176B4D]'
                    : 'bg-transparent hover:bg-[#F7F8F2]'
                }`}
              >
                <div
                  className={`whitespace-nowrap text-left text-[11px]/[normal] transition-colors duration-200 ${
                    isActive
                      ? 'font-bold text-white'
                      : 'font-normal text-[#65736B]'
                  }`}
                >
                  {range}
                </div>
              </button>
            );
          })}
        </div>
        <div
          data-pencil-name="Dinero realizado"
          className="box-border flex h-21 w-full shrink-0 flex-col items-start justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-4"
        >
          <div
            data-pencil-name="Top"
            className="box-border flex h-fit w-full shrink-0 items-center justify-between"
          >
            <div
              data-pencil-name="Label"
              className="whitespace-nowrap text-left text-[11px]/[normal] font-semibold text-[#65736B]"
            >
              Dinero realizado
            </div>
          </div>
          <div
            data-pencil-name="Value Row"
            className="box-border flex h-fit w-full shrink-0 items-end justify-start gap-2"
          >
            <div
              data-pencil-name="Value"
              className="whitespace-nowrap text-left text-[24px]/[normal] font-normal tracking-[-1.4px] text-[#17221D]"
            >
              S/ 0.00
            </div>
          </div>
        </div>

        <div
          data-pencil-name="Small KPIs"
          className="box-border grid min-h-24 w-full shrink-0 grid-cols-2 items-start justify-start gap-2.5"
        >
          <div
            data-pencil-name="Ventas totales"
            className="box-border flex h-full flex-[1_1_0] flex-col items-start justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-3.5"
          >
            <div
              data-pencil-name="Label"
              className="text-left text-[10.5px]/[normal] font-normal text-[#65736B]"
            >
              Ventas totales
            </div>
            <div
              data-pencil-name="Value Row"
              className="box-border flex h-fit w-fit shrink-0 items-end justify-start gap-1.5"
            >
              <div
                data-pencil-name="Value"
                className="whitespace-nowrap text-left text-[32px]/[normal] font-normal tracking-[-0.8px] text-[#17221D]"
              >
                0
              </div>
            </div>
          </div>
          <div
            data-pencil-name="Producto estrella"
            className="box-border flex h-full flex-[1_1_0] flex-col items-start justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-3.5"
          >
            <div
              data-pencil-name="Label"
              className="pb-1 text-left text-[10.5px]/[normal] font-normal text-[#65736B]"
            >
              Producto estrella
            </div>
            <div
              data-pencil-name="Name Row"
              className="box-border flex h-fit w-full shrink-0 items-center justify-start gap-1.25"
            >
              <div
                data-pencil-name="Name"
                className="text-left text-[11px]/[normal] font-normal tracking-[-0.2px] text-[#65736B]"
              >
                No hay datos
              </div>
            </div>
          </div>
        </div>
        {/* <section className="flex shrink-0 flex-col gap-2 rounded-[20px] border border-[#E4E9DF] bg-white p-3">
          <div className="flex w-full items-center justify-between gap-2">
            <h2 className="min-w-0 text-[12.5px] font-[750]">
              Ventas de hoy - Viernes 30
            </h2>
            <span className="flex shrink-0 items-center rounded-full bg-[#EAF2DF] px-2 py-0.5 text-[8.5px] font-bold text-[#104B37]">
              S/ 1,284.50
            </span>
          </div>
          <div className="flex w-full flex-1 items-end gap-1.5">
            {hourlySales.map((bar) => (
              <div
                key={bar.hour}
                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <span
                  className={`text-[7px] ${bar.highlight ? 'text-[#104B37]' : 'text-[#65736B]'}`}
                >
                  {bar.value}
                </span>
                <div
                  className={`w-full max-w-5 rounded-t-md rounded-b-xs ${
                    bar.highlight ? 'bg-[#104B37]' : 'bg-[#176B4D]'
                  }`}
                  style={{ height: bar.height }}
                />
              </div>
            ))}
          </div>
        </section> */}

        <div
          data-pencil-name="Top vendidos"
          className="box-border flex h-49.75 w-full shrink-0 flex-col items-start justify-start rounded-[20px] border border-[#E4E9DF] bg-white p-3.5"
        >
          <div
            data-pencil-name="Header"
            className="box-border flex h-fit w-full shrink-0 items-center justify-between pb-1.5"
          >
            <div
              data-pencil-name="Title"
              className="whitespace-nowrap text-left text-[12.5px]/[normal] font-normal text-[#17221D]"
            >
              Top 3 vendidos
            </div>
            <Button
              variant="link"
              className="h-auto whitespace-nowrap p-0 text-[9.5px]/[normal] font-normal text-[#176B4D] hover:text-[#176B4D] hover:underline"
            >
              <Link to="/best-sellers">Ver todos</Link>
            </Button>
          </div>
          <div className="flex w-full flex-1 items-center justify-center text-[11px] text-[#65736B]">
            No hay datos de ventas todavía
          </div>
        </div>
      </section>
    </div>
  );
}
