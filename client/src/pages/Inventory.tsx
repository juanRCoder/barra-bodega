import { Sidebar } from '@/components/Sidebar';
import { ProductCard } from '@/components/ProductCard';
import { ProductsApiError } from '@/services/products.service';
import { useProducts } from '@/hooks/useProducts';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Triangle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6;

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

export default function Inventory() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const productsQuery = useProducts({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: debouncedSearch,
  });
  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;
  const summary = productsQuery.data?.summary;
  const totalPages = pagination?.totalPages ?? 0;
  const visiblePages = getVisiblePages(currentPage, totalPages);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 250);
    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div
      className="flex w-full justify-center text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 px-3 pt-3 text-left">
        <div className="box-border flex min-h-11 w-full shrink-0 flex-wrap items-center justify-between gap-3">
          <div className="box-border flex min-w-0 flex-1 flex-row items-center justify-start gap-2.5">
            <Sidebar />
            <div className="box-border flex h-fit min-w-0 w-fit flex-col items-start justify-start gap-px">
              <div className="box-border w-full truncate text-left text-[23px]/[normal] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1.1px] text-[#17221D]">
                Inventario
              </div>
              <div className="box-border w-full truncate text-left text-[10.5px]/[normal] font-[Inter,system-ui,sans-serif] font-normal text-[#65736B]">
                {productsQuery.isPending
                  ? 'Cargando inventario…'
                  : `${summary?.totalProducts ?? 0} productos · ${summary?.restockCount ?? 0} por reponer`}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/scan/product')}
            className="box-border flex h-8.5 w-fit shrink-0 cursor-pointer flex-row items-center justify-start gap-1.5 rounded-full bg-[#D9F36A] px-3.25 py-0 transition-colors hover:bg-[#c9e15e]"
          >
            <Plus className="box-border size-3.5 shrink-0 text-[#104B37]" />
            <span className="box-border whitespace-nowrap text-left text-[11px]/[normal] font-[Inter,system-ui,sans-serif] font-bold text-[#104B37]">
              Agregar
            </span>
          </button>
        </div>

        <label className="box-border flex h-10 w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl border border-[#E4E9DF] bg-white px-3 py-0">
          <Search
            aria-hidden="true"
            className="box-border size-3.5 shrink-0 text-[#65736B]"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Buscar por código o nombre"
            aria-label="Buscar producto por código o nombre"
            className="h-full w-full bg-transparent text-[11px] text-[#17221D] outline-none placeholder:text-[#65736B]"
          />
        </label>

        {(summary?.restockCount ?? 0) > 0 && (
          <div className="box-border flex min-h-13.5 w-full shrink-0 flex-row items-center justify-start gap-2.25 rounded-2xl border border-[#E4E9DF] bg-white px-3 py-2">
            <div className="box-border flex size-8 shrink-0 flex-row items-center justify-center gap-0 rounded-xl bg-[#FAF1DE]">
              <Triangle className="box-border size-3.5 shrink-0 text-[#C98A1A]" />
            </div>
            <div className="box-border flex h-fit min-w-0 flex-1 flex-col items-start justify-start gap-px">
              <div className="line-clamp-2 text-left text-[10.5px]/[normal] font-[Inter,system-ui,sans-serif] font-bold text-[#17221D]">
                {summary?.restockCount} productos necesitan reposición
              </div>
            </div>
            <ChevronRight className="box-border size-3.5 shrink-0 text-[#65736B]" />
          </div>
        )}

        <div className="box-border w-full flex-1 flex flex-col gap-2 justify-start items-start">
          {productsQuery.isPending ? (
            <div
              className="w-full py-8 text-center text-[11px] text-[#65736B]"
              role="status"
            >
              Cargando productos…
            </div>
          ) : productsQuery.isError ? (
            <div className="flex w-full flex-col items-center gap-2 py-8 text-center text-[11px] text-[#B5392B]">
              <p role="alert">
                {productsQuery.error instanceof ProductsApiError
                  ? productsQuery.error.message
                  : 'No se pudo cargar el inventario.'}
              </p>
              <button
                type="button"
                onClick={() => void productsQuery.refetch()}
                className="cursor-pointer rounded-full bg-[#176B4D] px-4 py-2 font-semibold text-white"
              >
                Reintentar
              </button>
            </div>
          ) : products.length > 0 ? (
            <>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {totalPages > 1 && (
                <div className="box-border flex h-fit w-full shrink-0 flex-row items-center justify-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className="box-border flex size-7.5 shrink-0 items-center justify-center rounded-[10px] border border-[#E4E9DF] bg-[#F7F8F2] transition-colors hover:bg-[#E4E9DF] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="box-border size-3.5 shrink-0 text-[#65736B]" />
                  </button>
                  <div className="box-border flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-0.75">
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
                    <ChevronRight className="box-border size-3.5 shrink-0 text-white" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full py-8 text-center text-[11px] text-[#65736B]">
              {debouncedSearch
                ? 'No hay productos que coincidan con la búsqueda.'
                : 'Aún no tienes productos. Registra el primero para comenzar.'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
