import type { ProductData } from '@/types/inventory.type';
import { UpdateProduct } from './UpdateProduct';

type props = {
  product: ProductData;
};

const getStockStatus = (stock: number) => {
  if (stock <= 0) return 'danger';
  if (stock <= 10) return 'warning';
  return 'normal';
};

const getStockLabel = (stock: number) =>
  stock <= 0 ? 'Sin stock' : `${stock} en stock`;

export const ProductCard = ({ product }: props) => {
  const status = getStockStatus(product.stock);

  const stockColor = {
    normal: 'text-[#65736B]',
    warning: 'text-[#C98A1A]',
    danger: 'text-[#B5392B]',
  }[status];

  return (
    <div className="box-border w-full h-17 shrink-0 flex flex-col gap-0 px-3 py-2.5 justify-between items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-2xl">
      {/* Top: Nombre y Botón Editar */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-center">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="text-[12px]/[14px] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-medium tracking-[-0.2px] text-left truncate">
            {product.name}
          </div>
          <div className="text-[8px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left truncate">
            Código {product.code}
          </div>
        </div>
        <UpdateProduct
          productId={product.id}
          productName={product.name}
          initialPrice={product.price}
          initialStock={product.stock}
        />
      </div>

      {/* Bottom: Precio y Stock */}
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-between items-end">
        <div className="box-border w-fit shrink-0 h-fit flex flex-row gap-0.5 justify-start items-end">
          <div className="text-[13px]/[normal] box-border text-[#176B4D] font-[Inter,system-ui,sans-serif] font-extrabold tracking-[-0.3px] text-left whitespace-nowrap">
            S/ {product.price.toFixed(2)}
          </div>
          <div className="text-[7px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
            {product.unit}
          </div>
        </div>
        <div
          className={`text-[7.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap ${stockColor}`}
        >
          {getStockLabel(product.stock)}
        </div>
      </div>
    </div>
  );
};
