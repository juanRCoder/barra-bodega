import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Product = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  revenue: string;
};

const ITEMS_PER_PAGE = 5;

// Simulación: 24 productos (los 3 reales + relleno para que cuadre el "1 / 4")
const ALL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Coca Cola 500 ml',
    category: 'Bebidas',
    quantity: '48 unid.',
    revenue: 'S/ 336.00',
  },
  {
    id: 'p2',
    name: 'Queso fresco',
    category: 'Lácteos',
    quantity: '18 kg',
    revenue: 'S/ 321.30',
  },
  {
    id: 'p3',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },
  {
    id: 'p4',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },
  {
    id: 'p5',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },
  {
    id: 'p6',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },

  {
    id: 'p7',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },
  {
    id: 'p8',
    name: 'Pan francés',
    category: 'Panadería',
    quantity: '32 unid.',
    revenue: 'S/ 144.00',
  },
  // ...resto de productos (p4..p24) — reemplaza por datos reales
];

export default function BestSellers() {
  const navigate = useNavigate();
  const [activeRange, setActiveRange] = useState<string>('Hoy');
  const [page, setPage] = useState(1);

  const ranges = ['Hoy', 'Semana', 'Mes'] as const;

  const totalProducts = ALL_PRODUCTS.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / ITEMS_PER_PAGE));

  const visibleProducts = useMemo(
    () =>
      ALL_PRODUCTS.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [page]
  );

  const handleRangeChange = (range: string) => {
    setActiveRange(range);
    setPage(1);
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        {/* Top Bar (sin cambios relevantes) */}
        <div
          data-pencil-name="Top Bar"
          className="box-border w-full h-9 shrink-0 flex flex-row gap-2.5 justify-between items-center"
        >
          <button
            type="button"
            aria-label="Volver"
            onClick={() => navigate('/')}
            className="box-border size-9 shrink-0 flex flex-row gap-0 justify-center items-center bg-white [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-xl cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="box-border flex-1 h-fit flex flex-col gap-0 justify-start items-start">
            <div className="text-[15px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left whitespace-nowrap">
              Más vendidos
            </div>
            <div className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
              Semana 10 – 16 de marzo
            </div>
          </div>
        </div>

        {/* Range */}
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
                onClick={() => handleRangeChange(range)}
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

        {/* KPIs (sin cambios) */}
        <div
          data-pencil-name="KPIs"
          className="box-border w-full h-16 shrink-0 flex flex-row gap-2.5 justify-start items-start"
        >
          <div className="box-border flex-1 h-full flex flex-col gap-0 px-3 py-2.5 justify-between items-start bg-white [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-2xl">
            <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
              Unidades vendidas
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1.5 justify-start items-end">
              <div className="text-[14px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                128
              </div>
            </div>
          </div>
          <div className="box-border flex-1 h-full flex flex-col gap-0 px-3 py-2.5 justify-between items-start bg-white [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-2xl">
            <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
              Ingresos
            </div>
            <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1.5 justify-start items-end">
              <div className="text-[14px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                S/ 966.80
              </div>
            </div>
          </div>
        </div>

        {/* Ranking — TODO dinámico y paginado */}
        <div
          data-pencil-name="Ranking"
          className="box-border w-full shrink-0 flex flex-col gap-0 p-3.5 justify-start items-start bg-white [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-[20px]"
        >
          {/* Header */}
          <div
            data-pencil-name="Header"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 pb-2 justify-between items-center"
          >
            <div className="text-[12.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
              Ranking de productos
            </div>
            <div
              data-pencil-name="Chip"
              className="box-border w-fit shrink-0 h-fit flex flex-row gap-0 px-2 py-0.75 justify-start items-center bg-[#F7F8F2] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-full"
            >
              <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
                {visibleProducts.length} de {totalProducts}
              </div>
            </div>
          </div>

          {/* Filas */}
          {visibleProducts.map((product, index) => {
            const absoluteRank = (page - 1) * ITEMS_PER_PAGE + index + 1;
            const isTop = absoluteRank === 1;

            return (
              <div
                key={product.id}
                data-pencil-name={`Row ${product.name}`}
                className="box-content w-full h-[69.5px] shrink-0 flex flex-row gap-2.25 justify-start items-center border-b border-solid border-[#E4E9DF] m-[0px_0px_-0.5px_0px]"
              >
                <div
                  data-pencil-name="Rank"
                  className={`box-border size-7 shrink-0 flex flex-row gap-0 justify-center items-center rounded-[9px] ${
                    isTop ? 'bg-[#D9F36A]' : 'bg-[#EAF2DF]'
                  }`}
                >
                  <div className="text-[9px]/[normal] box-border text-[#104B37] font-[Inter,system-ui,sans-serif] font-extrabold text-left whitespace-nowrap">
                    {String(absoluteRank).padStart(2, '0')}
                  </div>
                </div>

                <div className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start">
                  <div className="text-[11px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    {product.name}
                  </div>
                  <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    {product.category} · {product.quantity}
                  </div>
                </div>

                <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0.5 justify-start items-end">
                  <div className="text-[10.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                    {product.revenue}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pager */}
          <div
            data-pencil-name="Pager"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-2 pt-2.5 justify-between items-center"
          >
            <div className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap">
              {visibleProducts.length} de {totalProducts} productos
            </div>
            <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-1.5 justify-start items-center">
              <button
                type="button"
                onClick={goPrev}
                disabled={page === 1}
                aria-label="Página anterior"
                className="box-border size-6 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="text-[#65736B] size-3.5" />
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
                <ChevronRight className="text-white size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
