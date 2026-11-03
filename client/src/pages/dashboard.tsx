import { Sidebar } from '@/components/Sidebar';
import { useState } from 'react';

const hourlySales = [
  { hour: '08', value: 42, height: 35 },
  { hour: '10', value: 68, height: 50 },
  { hour: '12', value: 96, height: 66 },
  { hour: '14', value: 74, height: 53 },
  { hour: '16', value: 58, height: 44 },
  { hour: '18', value: 88, height: 61 },
  { hour: '20', value: 120, height: 80, highlight: true },
  { hour: '22', value: 64, height: 47 },
];

const topProducts = [
  {
    rank: '01',
    name: 'Coca Cola 500 ml',
    units: '48 unid.',
    revenue: 'S/ 336.00',
  },
  { rank: '02', name: 'Pan francés', units: '32 unid.', revenue: 'S/ 144.00' },
  { rank: '03', name: 'Queso fresco', units: '18 kg', revenue: 'S/ 321.30' },
];

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState<string>('Hoy');
  const ranges = ['Hoy', 'Semana', 'Mes'] as const;

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
              Mi negocio
            </div>
            <div
              data-pencil-name="Sub"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-normal text-[#65736B]"
            >
              Martes 12, 2026
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
              RP
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
                onClick={() => setActiveRange(range)}
                className={`box-border flex h-7.5 flex-1 items-center justify-center rounded-full transition-colors duration-200 ${
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
              S/ 1,284.50
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
              Ventas totales de hoy
            </div>
            <div
              data-pencil-name="Value Row"
              className="box-border flex h-fit w-fit shrink-0 items-end justify-start gap-1.5"
            >
              <div
                data-pencil-name="Value"
                className="whitespace-nowrap text-left text-[32px]/[normal] font-normal tracking-[-0.8px] text-[#17221D]"
              >
                68
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
              Producto estrella de hoy
            </div>
            <div
              data-pencil-name="Name Row"
              className="box-border flex h-fit w-full shrink-0 items-center justify-start gap-1.25"
            >
              <div
                data-pencil-name="Name"
                className="text-left text-[12px]/[normal] font-normal tracking-[-0.2px] text-[#17221D]"
              >
                Coca Cola 500 ml Coca Cola 500 ml
              </div>
              <div
                data-pencil-name="Badge"
                className="box-border shrink-0 flex flex-row gap-0 size-6.5 justify-center items-center bg-[#D9F36A] rounded-[999px]"
              >
                <div
                  data-pencil-name="Text"
                  className="whitespace-nowrap text-left text-xs/[normal] font-normal text-[#104B37]"
                >
                  48
                </div>
              </div>
            </div>
            <div
              data-pencil-name="Note"
              className="text-left text-[9px]/[normal] font-normal text-[#65736B]"
            >
              S/ 336 en ingresos
            </div>
          </div>
        </div>
        <section className="flex shrink-0 flex-col gap-2 rounded-[20px] border border-[#E4E9DF] bg-white p-3">
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
        </section>

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
            <div
              data-pencil-name="Link"
              className="whitespace-nowrap text-left text-[9.5px]/[normal] font-normal text-[#176B4D]"
            >
              Ver todos
            </div>
          </div>
          {topProducts.map((product) => (
            <div
              key={product.rank}
              className="box-border flex h-12.5 w-full flex-[1_1_0] items-center justify-start gap-2 border-b border-[#E4E9DF] last:border-b-0"
            >
              <span className="whitespace-nowrap text-left text-[8.5px]/[normal] text-[#65736B]">
                {product.rank}
              </span>
              <span className="min-w-0 flex-1 text-left text-[10.5px]/[normal] font-semibold text-[#17221D]">
                {product.name}
              </span>
              <span className="whitespace-nowrap text-left text-[8.5px]/[normal] text-[#65736B]">
                {product.units}
              </span>
              <span className="whitespace-nowrap text-left text-[9.5px]/[normal] font-bold text-[#104B37]">
                {product.revenue}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
