import { Sidebar } from '@/components/Sidebar';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Triangle,
} from 'lucide-react';
import { useState } from 'react';

// --- Datos de ejemplo ---
const productsData = [
  {
    id: '1',
    name: 'Coca Cola 500 ml',
    price: 'S/ 7.00',
    unit: '/ unid.',
    stock: '24 en stock',
    stockStatus: 'normal', // 'normal' | 'warning' | 'danger'
  },
  {
    id: '2',
    name: 'Queso fresco',
    price: 'S/ 38.90',
    unit: '/ kg',
    stock: '9 en stock',
    stockStatus: 'warning',
  },
  {
    id: '3',
    name: 'Azúcar rubia 1 kg',
    price: 'S/ 4.50',
    unit: 'kg',
    stock: 'Sin stock',
    stockStatus: 'danger',
  },
];

const totalPages = 10;

const getVisiblePages = (currentPage: number, pageCount: number) => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis-end', pageCount] as const;
  }

  if (currentPage >= pageCount - 2) {
    return [
      1,
      'ellipsis-start',
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ] as const;
  }

  return [
    1,
    'ellipsis-start',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-end',
    pageCount,
  ] as const;
};

// --- Subcomponente para la tarjeta del producto ---
const ProductCard = ({ product }: { product: (typeof productsData)[0] }) => {
  const stockColor = {
    normal: 'text-[#65736B]',
    warning: 'text-[#C98A1A]',
    danger: 'text-[#B5392B]',
  }[product.stockStatus];

  return (
    <div className="box-border w-full h-17 shrink-0 flex flex-col gap-0 px-3 py-2.5 justify-between items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-2xl">
      {/* Top: Nombre y Botón Editar */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-center">
        <div className="text-[12px]/[14px] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-medium tracking-[-0.2px] text-left truncate flex-1 min-w-0">
          {product.name}
        </div>
        <button
          type="button"
          aria-label={`Editar ${product.name}`}
          className="box-border size-6.5 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] border border-[#E4E9DF] rounded-[13px] hover:bg-[#E4E9DF] transition-colors cursor-pointer"
        >
          <Pencil className="box-border size-3.5 shrink-0 text-[#176B4D]" />
        </button>
      </div>

      {/* Bottom: Precio y Stock */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-end">
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0.5 justify-start items-end">
          <div className="text-[13px]/[normal] box-border text-[#176B4D] font-[Inter,system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left whitespace-nowrap">
            {product.price}
          </div>
          <div className="text-[7px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
            {product.unit}
          </div>
        </div>
        <div
          className={`text-[7.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap ${stockColor}`}
        >
          {product.stock}
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
export default function Inventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        {/* TOP BAR CORREGIDO */}
        <div className="box-border w-full min-h-11 shrink-0 flex flex-wrap gap-3 justify-between items-center">
          <div className="box-border flex flex-row gap-2.5 justify-start items-center min-w-0 flex-1">
            <Sidebar />
            <div className="box-border w-fit h-fit flex flex-col gap-px justify-start items-start min-w-0">
              <div className="text-[23px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.1px] text-left truncate w-full">
                Inventario
              </div>
              <div className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left truncate w-full">
                142 productos · 3 por reponer
              </div>
            </div>
          </div>
          <button className="box-border w-fit shrink-0 h-8.5 flex flex-row gap-1.5 px-3.25 py-0 justify-start items-center bg-[#D9F36A] rounded-full hover:bg-[#c9e15e] transition-colors cursor-pointer">
            <Plus className="box-border size-3.5 shrink-0 text-[#104B37]" />
            <div className="text-[11px]/[normal] box-border text-[#104B37] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap">
              Agregar
            </div>
          </button>
        </div>

        {/* SEARCH */}
        <div className="box-border w-full h-10 shrink-0 flex flex-row gap-2 px-3 py-0 justify-start items-center bg-[#FFFFFF] border border-[#E4E9DF] rounded-xl">
          <Search className="box-border size-3.5 shrink-0 text-[#65736B]" />
          <input
            type="search"
            placeholder="Buscar producto por codigo o nombre"
            className="w-full h-full bg-transparent text-[11px] outline-none text-[#17221D] placeholder-[#65736B]"
          />
        </div>

        {/* RESTOCK CORREGIDO */}
        <div className="box-border w-full min-h-13.5 shrink-0 flex flex-row gap-2.25 px-3 py-2 justify-start items-center bg-[#FFFFFF] border border-[#E4E9DF] rounded-2xl">
          <div className="box-border size-8 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#FAF1DE] rounded-xl">
            <Triangle className="box-border size-3.5 shrink-0 text-[#C98A1A]" />
          </div>
          <div className="box-border flex-1 min-w-0 h-fit flex flex-col gap-px justify-start items-start">
            <div className="text-[10.5px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-bold text-left line-clamp-2">
              3 productos necesitan reposición
            </div>
          </div>
          <ChevronRight className="box-border size-3.5 shrink-0 text-[#65736B]" />
        </div>

        {/* GRID DE PRODUCTOS DINÁMICO */}
        <div className="box-border w-full flex-1 flex flex-col gap-2 justify-start items-start">
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

          {/* PAGER */}
          <div className="box-border w-full h-fit shrink-0 flex flex-row gap-1.5 pt-1.5 justify-center items-center">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="box-border flex size-7.5 shrink-0 items-center justify-center rounded-[10px] border border-[#E4E9DF] bg-[#F7F8F2] transition-colors hover:bg-[#E4E9DF] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="box-border size-3.5 shrink-0 text-[#65736B]" />
            </button>
            <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0.75 justify-start items-center">
              {visiblePages.map((page) => {
                if (typeof page !== 'number') {
                  return (
                    <span
                      key={page}
                      aria-hidden="true"
                      className="px-1 text-[9.5px]/[normal] font-semibold text-[#65736B]"
                    >
                      …
                    </span>
                  );
                }

                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`box-border flex size-6.5 shrink-0 cursor-pointer items-center justify-center rounded-[9px] transition-colors ${
                      isActive ? 'bg-[#104B37]' : 'hover:bg-[#E4E9DF]'
                    }`}
                  >
                    <span
                      className={`whitespace-nowrap text-left text-[9.5px]/[normal] font-bold ${
                        isActive ? 'text-white' : 'text-[#65736B]'
                      }`}
                    >
                      {page}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Página siguiente"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="box-border flex size-7.5 shrink-0 items-center justify-center rounded-[10px] bg-[#17221D] transition-colors hover:bg-[#104B37] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="box-border size-3.5 shrink-0 text-[#FFFFFF]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
