const ranges = ['Hoy', 'Semana', 'Mes'];

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
  { rank: '01', name: 'Coca Cola 500 ml', units: '48 unid.', revenue: 'S/ 336.00' },
  { rank: '02', name: 'Pan francés', units: '32 unid.', revenue: 'S/ 144.00' },
  { rank: '03', name: 'Queso fresco', units: '18 kg', revenue: 'S/ 321.30' },
];

function BellIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <main className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        <header className="flex h-8 shrink-0 items-center justify-between">
          <div className="flex items-center gap-2.25">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] bg-[#D9F36A]">
              <span className="text-[14px] font-bold text-[#104B37]">▥</span>
            </div>
            <span className="text-[14.5px] font-[850] tracking-[-0.5px]">BarraBodega</span>
          </div>
          <button
            type="button"
            aria-label="Notificaciones"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E4E9DF] bg-white text-[#104B37]"
          >
            <BellIcon />
          </button>
        </header>

        <div className="flex shrink-0 items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[23px] font-[850] leading-none tracking-[-1.1px]">Mi negocio</h1>
            <p className="text-[10.5px] text-[#65736B]">Martes 12, 2026</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF2DF] text-[10px] font-[750] text-[#104B37]">
            RP
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#E4E9DF] bg-white p-1">
          {ranges.map((range, index) => (
            <button
              key={range}
              type="button"
              className={`flex h-8 flex-1 items-center justify-center rounded-full text-[11px] ${
                index === 0 ? 'bg-[#176B4D] font-bold text-white' : 'font-[550] text-[#65736B]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <section className="flex shrink-0 flex-col gap-2 justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-4">
          <span className="text-[11px] font-semibold text-[#65736B]">Dinero realizado</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-[820] leading-none tracking-[-1.4px]">S/ 1,284.50</span>
          </div>
        </section>

        <div className="flex min-h-24 shrink-0 flex-col gap-2.5 min-[360px]:flex-row">
          <section className="flex flex-1 flex-col justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-3.5">
            <span className="text-[10.5px] font-[550] text-[#65736B]">Ventas totales de hoy</span>
            <div className="flex items-end gap-1.5">
              <span className="text-[32px] font-[820] leading-none tracking-[-0.8px]">68</span>
            </div>
          </section>

          <section className="flex flex-1 flex-col justify-between rounded-[20px] border border-[#E4E9DF] bg-white p-3.5">
            <span className="text-[10.5px] font-[550] text-[#65736B]">
              Producto estrella de hoy
            </span>
            <div className="flex w-full min-w-0 items-center justify-between gap-2">
              <span className="min-w-0 text-[12px] font-[750] tracking-[-0.2px]">
                Coca Cola 500 ml
              </span>
              <span className="flex shrink-0 items-center rounded-full bg-[#D9F36A] px-1.5 py-0.5 text-[8.5px] font-[750] text-[#104B37]">
                48
              </span>
            </div>
            <span className="text-[9px] text-[#65736B]">S/ 336 en ingresos</span>
          </section>
        </div>

        <section className="flex shrink-0 flex-col gap-2 rounded-[20px] border border-[#E4E9DF] bg-white p-3">
          <div className="flex w-full items-center justify-between gap-2">
            <h2 className="min-w-0 text-[12.5px] font-[750]">Ventas de hoy - Viernes 30</h2>
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

        <section className="flex shrink-0 flex-col rounded-[20px] border border-[#E4E9DF] bg-white p-3.5">
          <div className="flex w-full items-center justify-between pb-1.5">
            <h2 className="text-[12.5px] font-[750]">Top 3 vendidos</h2>
            <button type="button" className="text-[9.5px] font-[650] text-[#176B4D]">
              Ver todos
            </button>
          </div>
          {topProducts.map((product) => (
            <div
              key={product.rank}
              className="flex w-full min-w-0 flex-1 items-center gap-2 py-2 border-b border-[#E4E9DF] last:border-b-0"
            >
              <span className="shrink-0 text-[8.5px] font-[650] text-[#65736B]">
                {product.rank}
              </span>
              <span className="min-w-0 text-[10.5px] font-semibold">{product.name}</span>
              <span className="h-px flex-1" />
              <span className="shrink-0 text-[8.5px] text-[#65736B]">{product.units}</span>
              <span className="shrink-0 text-[9.5px] font-bold text-[#104B37]">
                {product.revenue}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
