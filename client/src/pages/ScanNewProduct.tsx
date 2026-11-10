import { ArrowLeft, Barcode, CircleCheck, Plus } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useCreateProduct } from '@/hooks/useProducts';
import { ProductsApiError } from '@/services/products.service';

export default function NewProduct() {
  const navigate = useNavigate();
  const readerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedBarcodeRef = useRef<string | null>(null);

  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [cameraError, setCameraError] = useState(false);
  const createProductMutation = useCreateProduct();

  useEffect(() => {
    if (!readerRef.current) return;

    const scanner = new Html5Qrcode(readerRef.current.id, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.QR_CODE,
      ],
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true,
      },
      verbose: false,
    });
    scannerRef.current = scanner;

    const scanSound = new Audio('/store-scanner-beep.mp3');
    scanSound.preload = 'auto';

    let cancelled = false;

    const startPromise = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 15, qrbox: { width: 300, height: 150 } },
        (decodedText) => {
          if (cancelled) return;
          setBarcode(decodedText);
          // El mismo código puede detectarse en varios frames seguidos.
          if (lastScannedBarcodeRef.current !== decodedText) {
            lastScannedBarcodeRef.current = decodedText;
            scanSound.currentTime = 0;
            void scanSound.play().catch((err: unknown) => {
              console.error('Scanner beep playback error', err);
            });
          }
        },
        () => {}
      )
      .catch((err) => {
        if (!cancelled) {
          console.error('Camera start error', err);
          setCameraError(true);
        }
      });

    return () => {
      cancelled = true;
      scanSound.pause();

      // La cámara solo se detiene al salir de esta pantalla.
      startPromise.finally(() => {
        scanner
          .stop()
          .then(() => scanner.clear())
          .catch(() => {});
      });
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (
      !name.trim() ||
      !barcode.trim() ||
      !Number.isFinite(parsedPrice) ||
      parsedPrice < 0 ||
      !Number.isInteger(parsedStock) ||
      parsedStock < 0
    ) {
      return;
    }

    createProductMutation.mutate(
      {
        name: name.trim(),
        code: barcode.trim(),
        price: parsedPrice,
        stock: parsedStock,
      },
      { onSuccess: () => navigate('/inventory') }
    );
  };

  return (
    <div
      className="flex h-screen w-full justify-center overflow-hidden bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex h-full w-full max-w-97.5 flex-col overflow-hidden text-left">
        {/* ===== Scanner con cámara ===== */}
        <div
          data-pencil-name="Camera"
          className="relative box-border w-full h-[30%] flex-1 min-h-0 overflow-hidden bg-black"
        >
          {/* Video de la cámara trasera (reemplaza el gradiente) */}
          <div
            id="barcode-reader"
            ref={readerRef}
            className="absolute inset-0 h-full w-full [&>video]:h-full [&>video]:w-full [&>video]:object-cover"
          />

          {/* Fallback si la cámara falla */}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(-151.107deg,#0B1A14_13.019%,#173E2C_86.981%)]">
              <div className="px-6 text-center text-[10px]/[normal] font-[Inter,system-ui,sans-serif] text-[#D7E4D5]">
                No se pudo acceder a la cámara. Ingresa el código manualmente.
              </div>
            </div>
          )}

          {/* Top Bar — se mantiene */}
          <div className="absolute inset-x-0 top-3.5 z-10 flex h-fit w-full flex-row items-center justify-between gap-0 px-4">
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate('/inventory')}
              className="box-border size-8.5 shrink-0 cursor-pointer rounded-[17px] bg-[#FFFFFF14] flex items-center justify-center"
            >
              <ArrowLeft className="size-4 shrink-0 text-white" />
            </button>
          </div>

          {/* Scan Frame centrado — se mantiene con sus barras */}
          <div className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center mb-4">
            {/* DENTRO DE ESTE CUADRO DEBE DETECTAR EL CODIGO DE BARRA */}
            {/* <div className="relative h-30 w-full max-w-64.5">
              <div className="absolute -left-1.5 -top-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:3px_0_0_3px]" />
              <div className="absolute -right-1.5 -top-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:3px_3px_0_0]" />
              <div className="absolute -bottom-1.5 -left-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:0_0_3px_3px]" />
              <div className="absolute -bottom-1.5 -right-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:0_3px_3px_0]" />
            </div> */}
          </div>

          {/* Hint — se mantiene */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-2 px-4">
            <div className="box-border text-center text-[10px]/[normal] font-[Inter,system-ui,sans-serif] font-normal whitespace-nowrap text-[#D7E4D5]">
              Apunta al código de barras dentro del marco
            </div>
          </div>
        </div>

        {/* ===== Form — se mantiene igual ===== */}
        <form
          onSubmit={handleSubmit}
          data-pencil-name="Nuevo producto Sheet"
          className="box-border flex w-full h-[70%] shrink-0 flex-col items-start justify-start gap-3 rounded-t-3xl bg-[#FFFFFF] px-4.5 pt-2.5 pb-5 [box-shadow:0px_-20px_60px_#13362633]"
        >
          <div className="flex h-1 w-full shrink-0 flex-row items-start justify-center gap-0">
            <div className="h-1 w-9 shrink-0 rounded-full bg-[#E4E9DF]" />
          </div>

          <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-px">
            <h2 className="m-0 box-border text-left text-[17px]/[normal] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.5px] whitespace-nowrap text-[#17221D]">
              Nuevo producto
            </h2>
            <div className="box-border text-left text-[9px]/[normal] font-[Inter,system-ui,sans-serif] font-normal whitespace-nowrap text-[#65736B]">
              Revisa los datos antes de agregarlo
            </div>
          </div>

          {/* Name */}
          <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.25">
            <label
              htmlFor="new-product-name"
              className="box-border text-left text-[9.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold whitespace-nowrap text-[#65736B]"
            >
              Nombre del producto
            </label>
            <div className="flex h-11.5 w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl bg-[#FFFFFF] p-[0_12px] transition-[outline-color,outline-width] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]">
              <input
                id="new-product-name"
                name="name"
                type="text"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Queso fresco"
                autoComplete="off"
                className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[11.5px]/[normal] font-[Inter,system-ui,sans-serif] font-normal text-[#17221D] outline-none placeholder:text-[#65736B]"
              />
            </div>
          </div>

          {/* Barcode */}
          <div className="flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.25">
            <label
              htmlFor="new-product-barcode"
              className="box-border text-left text-[9.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold whitespace-nowrap text-[#65736B]"
            >
              Código del producto
            </label>
            <div className="flex h-11.5 w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl bg-[#FFFFFF] p-[0_12px] transition-[outline-color,outline-width] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]">
              <Barcode className="size-3.75 shrink-0 text-[#65736B]" />
              <input
                id="new-product-barcode"
                name="barcode"
                type="text"
                required
                maxLength={100}
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="Ej. 7501055300012"
                className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[11.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold tracking-[0.4px] text-[#17221D] outline-none"
              />
              <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-0 rounded-full bg-[#EAF2DF] p-[3px_8px]">
                <div className="box-border text-left text-[7.5px]/[normal] font-[Inter,system-ui,sans-serif] font-bold whitespace-nowrap text-[#104B37]">
                  Global
                </div>
              </div>
            </div>
          </div>

          {/* Price + Stock */}
          <div className="flex h-fit w-full shrink-0 flex-row items-start justify-start gap-2.5">
            <div className="flex h-fit min-w-0 flex-1 flex-col items-start justify-start gap-1.25">
              <label
                htmlFor="new-product-price"
                className="box-border text-left text-[9.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold whitespace-nowrap text-[#65736B]"
              >
                Precio
              </label>
              <div className="flex h-11.5 w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl bg-[#FFFFFF] p-[0_12px] transition-[outline-color,outline-width] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]">
                <span className="box-border select-none text-left text-[13px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold whitespace-nowrap text-[#65736B]">
                  S/
                </span>
                <input
                  id="new-product-price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => {
                    const clean = e.target.value
                      .replace(/[^\d.]/g, '')
                      .replace(/(\..*)\./g, '$1');
                    setPrice(clean);
                  }}
                  onBlur={(e) => {
                    const n = parseFloat(e.target.value);
                    if (!Number.isNaN(n)) setPrice(n.toFixed(2));
                  }}
                  placeholder="0.00"
                  className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[13px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold text-[#17221D] outline-none placeholder:text-[#65736B]"
                />
                <span className="box-border select-none text-left text-[8.5px]/[normal] font-[Inter,system-ui,sans-serif] font-normal whitespace-nowrap text-[#65736B]">
                  unid.
                </span>
              </div>
            </div>

            <div className="flex h-fit min-w-0 flex-1 flex-col items-start justify-start gap-1.25">
              <label
                htmlFor="new-product-stock"
                className="box-border text-left text-[9.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold whitespace-nowrap text-[#65736B]"
              >
                Stock
              </label>
              <div className="flex h-11.5 w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl bg-[#FFFFFF] p-[0_12px] transition-[outline-color,outline-width] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]">
                <input
                  id="new-product-stock"
                  name="stock"
                  type="text"
                  inputMode="numeric"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[13px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold text-[#17221D] outline-none placeholder:text-[#65736B]"
                />
                <span className="box-border select-none text-left text-[8.5px]/[normal] font-[Inter,system-ui,sans-serif] font-normal whitespace-nowrap text-[#65736B]">
                  unid.
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex h-fit w-full shrink-0 flex-row items-center justify-start gap-2 rounded-xl bg-[#EAF2DF] p-2.5">
            <CircleCheck className="size-3.25 shrink-0 text-[#176B4D]" />
            <div className="box-border text-left text-[8.5px]/[normal] font-[Inter,system-ui,sans-serif] font-normal whitespace-nowrap text-[#104B37]">
              Se agregará al inventario listo para la venta.
            </div>
          </div>

          {/* Add */}
          <button
            type="submit"
            disabled={createProductMutation.isPending}
            className="flex h-12 w-full shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-[#176B4D] transition-colors hover:bg-[#104B37] [box-shadow:0px_10px_24px_#176B4D33] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="size-4 shrink-0 text-white" />
            <span className="box-border text-left text-[12.5px]/[normal] font-[Inter,system-ui,sans-serif] font-bold whitespace-nowrap text-white">
              {createProductMutation.isPending
                ? 'Agregando…'
                : 'Agregar producto'}
            </span>
          </button>
          {createProductMutation.isError && (
            <p className="m-0 text-[10px] text-[#B5392B]" role="alert">
              {createProductMutation.error instanceof ProductsApiError
                ? createProductMutation.error.message
                : 'No se pudo registrar el producto.'}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
