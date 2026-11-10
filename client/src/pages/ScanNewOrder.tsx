import { CartItem } from '@/components/CartItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
} from '@/components/ui/select';
import type { Product } from '@/types/scan.type';
import {
  ArrowLeft,
  Banknote,
  Barcode,
  Check,
  Plus,
  Smartphone,
  Users,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccounts } from '@/hooks/useAccounts';
import { AccountsApiError } from '@/services/accounts.service';

const hiddenScrollbar =
  '[scrollbar-width:none] [-ms-overflow-style:none] ' +
  '[&::-webkit-scrollbar]:hidden';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Coca Cola 500 ml', price: 7.0, qty: 2, total: 14.0 },
  { id: '2', name: 'Atún Corbeta 300ml', price: 38.9, qty: 1, total: 38.9 },
];

type PaymentMethod = 'cash' | 'yape';

export default function ScanNewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const accountsQuery = useAccounts();
  const accounts = accountsQuery.data?.accounts ?? [];
  const initialAccountId =
    location.state &&
    typeof location.state === 'object' &&
    'accountId' in location.state &&
    typeof location.state.accountId === 'string'
      ? location.state.accountId
      : null;

  const [cameraError] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerId, setCustomerId] = useState<string | null>(initialAccountId);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [saleDone, setSaleDone] = useState(false);

  const total = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.qty, 0),
    [products]
  );
  const totalQty = useMemo(
    () => products.reduce((sum, p) => sum + p.qty, 0),
    [products]
  );
  const selectedAccount = accounts.find((account) => account.id === customerId);
  const customerName = selectedAccount?.name ?? 'Sin cuenta';

  /* ---------- Acciones ---------- */

  const increment = (id: string) =>
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: p.qty + 1, total: (p.qty + 1) * p.price } : p
      )
    );

  const decrement = (id: string) =>
    setProducts((prev) =>
      prev.flatMap((p) => {
        if (p.id !== id) return [p];
        const qty = p.qty - 1;
        if (qty <= 0) return []; // se elimina
        return [{ ...p, qty, total: qty * p.price }];
      })
    );

  const remove = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const addManual = () => {
    const name = manualName.trim();
    const price = parseFloat(manualPrice.replace(',', '.'));
    if (!name || isNaN(price) || price <= 0) return;

    // Si ya existe por nombre, suma cantidad
    const existing = products.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) {
      increment(existing.id);
    } else {
      const id = `manual-${Date.now()}`;
      setProducts((prev) => [
        ...prev,
        { id, name, price, qty: 1, total: price },
      ]);
    }
    setManualName('');
    setManualPrice('');
    setIsManualEntryOpen(false);
  };

  const handleRegister = () => {
    if (products.length === 0) return;
    // Aquí iría tu llamada al backend
    console.log('Registrar venta', {
      products,
      total,
      paymentMethod,
      accountId: selectedAccount?.id ?? null,
    });
    setSaleDone(true);
    setTimeout(() => setSaleDone(false), 2000);
  };

  return (
    <div
      className="flex h-dvh w-full justify-center overflow-hidden bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex h-full w-full max-w-97.5 flex-col overflow-hidden text-left">
        {/* ---------------- Cámara ---------------- */}
        <div className="relative box-border h-[40%] w-full shrink-0 overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
          />

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(-151.107deg,#0B1A14_13.019%,#173E2C_86.981%)]">
              <div className="flex flex-col items-center gap-2 px-6 text-center text-[10px] text-[#D7E4D5]">
                <Barcode aria-hidden="true" className="size-7 text-[#D9F36A]" />
                <span>
                  No se pudo acceder a la cámara. Usa el marco como referencia o
                  ingresa el código manualmente.
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-x-0 top-3.5 z-10 flex items-center justify-between px-4">
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate('/inventory')}
              className="size-8.5 shrink-0 cursor-pointer rounded-[17px] bg-[#FFFFFF14] flex items-center justify-center"
            >
              <ArrowLeft className="size-4 text-white" />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center">
            <div className="relative aspect-2/1 w-[min(260px,calc(100%-2rem))]">
              <div className="absolute -left-1 -top-1 size-7 border-l-[3px] border-t-[3px] border-[#D9F36A]" />
              <div className="absolute -right-1 -top-1 size-7 border-r-[3px] border-t-[3px] border-[#D9F36A]" />
              <div className="absolute -bottom-1 -left-1 size-7 border-b-[3px] border-l-[3px] border-[#D9F36A]" />
              <div className="absolute -bottom-1 -right-1 size-7 border-b-[3px] border-r-[3px] border-[#D9F36A]" />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-2 px-4">
            <div className="text-center text-[10px] text-[#D7E4D5]">
              {cameraError
                ? 'Coloca el código dentro del marco de referencia'
                : 'Apunta al código de barras dentro del marco'}
            </div>
          </div>
        </div>

        {/* ---------------- Formulario ---------------- */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
          className={`box-border flex h-[60%] w-full shrink-0 flex-col items-start justify-start gap-3 bg-white px-4.5 pt-2.5 pb-5 [box-shadow:0px_-20px_60px_#13362633] overflow-y-auto ${hiddenScrollbar}`}
        >
          <div className="flex h-1 w-full justify-center">
            <div className="h-1 w-9 rounded-full bg-[#E4E9DF]" />
          </div>

          {/* Header */}
          <div className="w-full flex justify-between items-center">
            <div className="flex flex-col gap-px">
              <div className="text-[17px] text-[#17221D] tracking-[-0.5px]">
                Venta en curso
              </div>
              <div className="text-[9px] text-[#65736B]">
                {products.length} productos escaneados
              </div>
            </div>
            <div className="p-[4px_9px] bg-[#EAF2DF] rounded-[999px]">
              <div className="text-[8.5px] text-[#104B37] font-bold">
                {totalQty} ítems
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="w-full flex flex-col">
            {products.length === 0 ? (
              <div className="text-[10px] text-[#65736B] py-3 text-center">
                Aún no hay productos. Escanea o registra uno manualmente.
              </div>
            ) : (
              products.map((p) => (
                <CartItem
                  key={p.id}
                  product={p}
                  onIncrement={() => increment(p.id)}
                  onDecrement={() => decrement(p.id)}
                  onRemove={() => remove(p.id)}
                />
              ))
            )}
          </div>

          {/* Registro manual */}
          <div className="w-full flex flex-col gap-1.5">
            {isManualEntryOpen && (
              <div className="w-full flex gap-1.75 items-center">
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Producto sin código"
                  aria-label="Nombre del producto manual"
                  className="h-10 min-w-0 flex-1 rounded-xl bg-white px-2.75 text-[10px] text-[#17221D] outline outline-[#E4E9DF] placeholder:text-[#65736B] focus:outline-[#176B4D]"
                />
                <div className="relative w-24 shrink-0">
                  <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#65736B]">
                    S/
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={manualPrice}
                    onChange={(e) =>
                      setManualPrice(e.target.value.replace(/[^0-9.,]/g, ''))
                    }
                    placeholder="0.00"
                    aria-label="Precio del producto manual"
                    className="h-10 w-full rounded-xl bg-white pl-7 pr-2.5 text-[10px] text-[#17221D] outline outline-[#E4E9DF] placeholder:text-[#65736B] focus:outline-[#176B4D]"
                  />
                </div>
                <button
                  type="button"
                  onClick={addManual}
                  disabled={!manualName.trim() || !manualPrice}
                  aria-label="Agregar producto manual"
                  className="flex size-10 items-center justify-center rounded-[20px] bg-[#176B4D] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="size-4 text-white" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsManualEntryOpen((open) => !open)}
              aria-expanded={isManualEntryOpen}
              className="flex w-fit items-center gap-1.25 border-b border-[#E4E9DF] text-xs text-[#17221D]"
            >
              <Plus className="size-3 text-[#176b4d]" />
              <span>
                {isManualEntryOpen
                  ? 'Cerrar registro manual'
                  : 'Agregar manual'}
              </span>
            </button>
          </div>

          {/* Método de pago */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="text-[9.5px] text-[#65736B] font-semibold">
              Método de pago
            </div>
            <div className="w-full flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`cursor-pointer flex-1 h-10.5 flex gap-1.75 justify-center items-center rounded-xl transition ${
                  paymentMethod === 'cash'
                    ? 'bg-[#EAF2DF] outline outline-[#176B4D]'
                    : 'bg-white outline outline-[#E4E9DF]'
                }`}
              >
                <Banknote
                  className={`w-3.5 h-3.5 ${
                    paymentMethod === 'cash'
                      ? 'text-[#176b4d]'
                      : 'text-[#65736b]'
                  }`}
                />
                <span
                  className={`text-[10.5px] ${
                    paymentMethod === 'cash'
                      ? 'text-[#104B37] font-bold'
                      : 'text-[#65736B]'
                  }`}
                >
                  Efectivo
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('yape')}
                className={`cursor-pointer flex-1 h-10.5 flex gap-1.75 justify-center items-center rounded-xl transition ${
                  paymentMethod === 'yape'
                    ? 'bg-[#EAF2DF] outline outline-[#176B4D]'
                    : 'bg-white outline outline-[#E4E9DF]'
                }`}
              >
                <Smartphone
                  className={`w-3.5 h-3.5 ${
                    paymentMethod === 'yape'
                      ? 'text-[#176b4d]'
                      : 'text-[#65736b]'
                  }`}
                />
                <span
                  className={`text-[10.5px] ${
                    paymentMethod === 'yape'
                      ? 'text-[#104B37] font-bold'
                      : 'text-[#65736B]'
                  }`}
                >
                  Yape
                </span>
              </button>
            </div>
          </div>

          {accounts.length > 0 && (
            <div className="w-full">
              <Select
                value={selectedAccount?.id ?? 'none'}
                onValueChange={(val) =>
                  setCustomerId(val === 'none' ? null : val)
                }
              >
                <SelectTrigger
                  className="
    w-full h-10.5 flex gap-2 px-2.75
    bg-[#FAFBF6] outline outline-[#E4E9DF] rounded-xl
    border-0 shadow-none focus:ring-0 focus:outline-[#176B4D]
    cursor-pointer data-[state=open]:outline-[#176B4D]
    [&>svg]:w-3 [&>svg]:h-3 [&>svg]:text-[#65736b] [&>svg]:opacity-100
    [&>svg]:transition [&>svg]:duration-200
    data-[state=open]:[&>svg]:rotate-180
  "
                >
                  <Users className="w-3.5 h-3.5 text-[#176b4d]" />
                  <span className="text-[9.5px] text-[#17221D]">
                    Cuenta de cliente
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#EAF2DF] rounded-full text-[6.5px] text-[#104B37] font-bold">
                    Opcional
                  </span>
                  <span className="flex-1" />
                  <span className="text-[9px] text-[#65736B] max-w-24 truncate">
                    {customerName}
                  </span>
                </SelectTrigger>

                <SelectContent
                  className="
        bg-white rounded-xl shadow-lg outline outline-[#E4E9DF]
        border-0 min-w-(--radix-select-trigger-width)
      "
                >
                  <SelectGroup>
                    <SelectItem
                      value="none"
                      className="text-[10px] px-3.5 focus:bg-[#EAF2DF] cursor-pointer"
                    >
                      <span className="text-[#65736B]">Sin cuenta</span>
                    </SelectItem>

                    {accounts.map((account) => (
                      <SelectItem
                        key={account.id}
                        value={account.id}
                        className="text-[10px] px-3 focus:bg-[#EAF2DF] cursor-pointer"
                      >
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          {accountsQuery.isError && (
            <div className="flex w-full items-center justify-between gap-2 text-[9px] text-[#B5392B]">
              <span role="alert">
                {accountsQuery.error instanceof AccountsApiError
                  ? accountsQuery.error.message
                  : 'No se pudieron cargar las cuentas.'}
              </span>
              <button
                type="button"
                onClick={() => void accountsQuery.refetch()}
                className="shrink-0 cursor-pointer font-semibold underline"
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="w-full h-px bg-[#E4E9DF]" />

          {/* Total */}
          <div className="w-full flex justify-between items-end">
            <div className="flex flex-col gap-px">
              <div className="text-[9.5px] text-[#65736B] font-semibold">
                Total a cobrar
              </div>
              <div className="text-[8.5px] text-[#65736B]">
                {products.length} productos · {totalQty} ítems
              </div>
            </div>
            <div className="text-[24px] text-[#17221D] tracking-[-0.9px]">
              S/ {total.toFixed(2)}
            </div>
          </div>

          {/* Registrar venta */}
          <button
            type="submit"
            disabled={products.length === 0}
            className={`w-full py-2.5 flex gap-2 justify-center items-center rounded-full transition [box-shadow:0px_10px_24px_#176B4D33] cursor-pointer ${
              saleDone
                ? 'bg-[#104B37]'
                : 'bg-[#176B4D] disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            {saleDone ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-[12px] text-white font-bold">
                  Venta registrada
                </span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-[12px] text-white font-bold">
                  Registrar venta · S/ {total.toFixed(2)}
                </span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
