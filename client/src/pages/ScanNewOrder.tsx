import { CartItem } from '@/components/CartItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
} from '@/components/ui/select';
import type { Product } from '@/types/scan.type';
import { ArrowLeft, Barcode, Check, Plus, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccounts } from '@/hooks/useAccounts';
import { AccountsApiError } from '@/services/accounts.service';
import { useCreateOrder } from '@/hooks/useOrders';
import {
  getOrderProductByCode,
  OrdersApiError,
} from '@/services/orders.service';
import type { ProductData } from '@/types/inventory.type';
import {
  Html5Qrcode,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from 'html5-qrcode';

const hiddenScrollbar =
  '[scrollbar-width:none] [-ms-overflow-style:none] ' +
  '[&::-webkit-scrollbar]:hidden';

export default function ScanNewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const readerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanLockRef = useRef(false);
  const accountsQuery = useAccounts();
  const createOrderMutation = useCreateOrder();
  const accounts = accountsQuery.data?.accounts ?? [];
  const initialAccountId =
    location.state &&
    typeof location.state === 'object' &&
    'accountId' in location.state &&
    typeof location.state.accountId === 'string'
      ? location.state.accountId
      : null;

  const [cameraError, setCameraError] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(initialAccountId);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [barcodeError, setBarcodeError] = useState('');
  const [saleDone, setSaleDone] = useState(false);

  const addInventoryProduct = useCallback((product: ProductData) => {
    setProducts((current) => {
      const existing = current.find(
        (item) => !item.isManual && item.id === product.id
      );
      if (existing) {
        return current.map((item) =>
          item.id === product.id && !item.isManual
            ? {
                ...item,
                qty: item.qty + 1,
                total: (item.qty + 1) * item.price,
              }
            : item
        );
      }

      return [
        ...current,
        {
          id: product.id,
          code: product.code,
          name: product.name,
          price: product.price,
          qty: 1,
          total: product.price,
        },
      ];
    });
  }, []);

  const lookupBarcode = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim();
      if (!code) return;

      setBarcodeError('');
      try {
        const product = await getOrderProductByCode(code);
        addInventoryProduct(product);
      } catch (error) {
        setBarcodeError(
          error instanceof OrdersApiError
            ? error.message
            : 'No se pudo consultar el código. Intenta nuevamente.'
        );
      }
    },
    [addInventoryProduct]
  );

  useEffect(() => {
    if (!readerRef.current) return;

    const scanner = new Html5Qrcode(readerRef.current.id, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.UPC_A,
      ],
      useBarCodeDetectorIfSupported: true,
      verbose: false,
    });
    scannerRef.current = scanner;
    let cancelled = false;

    const startPromise = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 260, height: 130 } },
        (decodedText) => {
          if (cancelled || scanLockRef.current) return;
          scanLockRef.current = true;
          void lookupBarcode(decodedText).finally(() => {
            window.setTimeout(() => {
              scanLockRef.current = false;
            }, 900);
          });
        },
        () => {}
      )
      .catch((error: unknown) => {
        if (!cancelled) {
          console.error('Camera start error', error);
          setCameraError(true);
        }
      });

    return () => {
      cancelled = true;
      void startPromise
        .then(async () => {
          if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
            await scanner.stop();
          }
          scanner.clear();
          scannerRef.current = null;
        })
        .catch((error: unknown) => {
          console.error('Camera stop error', error);
        });
    };
  }, [lookupBarcode]);

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
    const price = Number(manualPrice.replace(',', '.'));
    if (!name || !Number.isFinite(price) || price <= 0) return;

    const existing = products.find(
      (p) =>
        p.isManual &&
        p.name.toLowerCase() === name.toLowerCase() &&
        p.price === price
    );
    if (existing) {
      increment(existing.id);
    } else {
      const id = `manual-${Date.now()}`;
      setProducts((prev) => [
        ...prev,
        { id, name, price, qty: 1, total: price, isManual: true },
      ]);
    }
    setManualName('');
    setManualPrice('');
    setIsManualEntryOpen(false);
  };

  const handleRegister = () => {
    if (products.length === 0 || createOrderMutation.isPending) return;

    createOrderMutation.mutate(
      {
        accountId: selectedAccount?.id ?? null,
        items: products.map((product) =>
          product.isManual
            ? {
                type: 'manual',
                name: product.name,
                price: product.price,
                quantity: product.qty,
              }
            : {
                type: 'inventory',
                productAdminId: product.id,
                quantity: product.qty,
              }
        ),
      },
      {
        onSuccess: () => {
          setProducts([]);
          setSaleDone(true);
          window.setTimeout(() => setSaleDone(false), 2500);
        },
      }
    );
  };

  return (
    <div
      className="flex h-dvh w-full justify-center overflow-hidden bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex h-full w-full max-w-97.5 flex-col overflow-hidden text-left">
        {/* ---------------- Cámara ---------------- */}
        <div className="relative box-border h-[40%] w-full shrink-0 overflow-hidden bg-black">
          <div
            id="order-barcode-reader"
            ref={readerRef}
            className="absolute inset-0 h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
          />

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(-151.107deg,#0B1A14_13.019%,#173E2C_86.981%)]">
              <div className="flex flex-col items-center gap-2 px-6 text-center text-[10px] text-[#D7E4D5]">
                <Barcode aria-hidden="true" className="size-7 text-[#D9F36A]" />
                <span>
                  No se pudo acceder a la cámara. Usa el marco como referencia o
                  verifica los permisos de cámara.
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
                Pedido en curso
              </div>
              <div className="text-[9px] text-[#65736B]">
                {products.length} productos agregados
              </div>
            </div>
            <div className="p-[4px_9px] bg-[#EAF2DF] rounded-[999px]">
              <div className="text-[8.5px] text-[#104B37] font-bold">
                {totalQty} ítems
              </div>
            </div>
          </div>

          {barcodeError && (
            <p role="alert" className="m-0 w-full text-[10px] text-[#B5392B]">
              {barcodeError}
            </p>
          )}

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
              className="flex w-fit items-center gap-1.25 text-[11px] text-[#65736B] cursor-pointer"
            >
              <Plus className="size-3 text-[#176b4d]" />
              <span className="underline">
                {isManualEntryOpen
                  ? 'Cerrar registro manual'
                  : 'Agregar manual'}
              </span>
            </button>
          </div>

          {(accounts.length > 0 || accountsQuery.isPending) && (
            <div className="w-full">
              <Select
                value={selectedAccount?.id ?? 'none'}
                onValueChange={(val) =>
                  setCustomerId(val === 'none' ? null : val)
                }
              >
                <SelectTrigger
                  disabled={accountsQuery.isPending}
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
            disabled={
              products.length === 0 ||
              createOrderMutation.isPending ||
              (Boolean(initialAccountId) && accountsQuery.isError)
            }
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
                  Pedido registrado
                </span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-white" />
                <span className="text-[12px] text-white font-bold">
                  {createOrderMutation.isPending
                    ? 'Registrando pedido…'
                    : `Registrar pedido · S/ ${total.toFixed(2)}`}
                </span>
              </>
            )}
          </button>
          <div className="w-full text-center text-[9px] text-[#65736B]">
            {selectedAccount
              ? `Quedará pendiente en la cuenta de ${selectedAccount.name}`
              : 'Se registrará como pagado'}
          </div>
          {createOrderMutation.isError && (
            <p
              role="alert"
              className="m-0 w-full text-center text-[10px] text-[#B5392B]"
            >
              {createOrderMutation.error instanceof OrdersApiError
                ? createOrderMutation.error.message
                : 'No se pudo registrar el pedido. Intenta nuevamente.'}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
