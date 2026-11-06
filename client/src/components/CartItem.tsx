import type { Product } from '@/types/scan.type';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  product: Product;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
}

export const CartItem = ({
  product,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="w-full flex items-center gap-2 py-2 border-b border-[#F0F2EA] last:border-b-0">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-[#17221D] truncate">
          {product.name}
        </div>
        <div className="text-[9px] text-[#65736B]">
          S/ {product.price.toFixed(2)} c/u
        </div>
      </div>

      {/* Cantidad */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onDecrement}
          className="w-6 h-6 rounded-full bg-[#EAF2DF] flex items-center justify-center"
          aria-label="Quitar uno"
        >
          <Minus className="w-3 h-3 text-[#176B4D]" />
        </button>
        <span className="text-[11px] text-[#17221D] w-5 text-center tabular-nums">
          {product.qty}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="w-6 h-6 rounded-full bg-[#EAF2DF] flex items-center justify-center"
          aria-label="Agregar uno"
        >
          <Plus className="w-3 h-3 text-[#176B4D]" />
        </button>
      </div>

      {/* Total */}
      <div className="w-14 text-right text-[11px] text-[#17221D] tabular-nums shrink-0">
        S/ {(product.price * product.qty).toFixed(2)}
      </div>

      {/* Eliminar */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-6 h-6 flex items-center justify-center text-[#65736B] hover:text-red-500 shrink-0"
          aria-label="Eliminar"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
