import { ArrowLeft, Barcode, CircleCheck, Plus } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProduct() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("7501055300012");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("No se pudo acceder a la cámara:", err);
        setCameraError(true);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      barcode,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
    };
    console.log(payload);
    // TODO: llamar API
    navigate("/inventory");
  };

  return (
    <div
      className="flex h-screen w-full justify-center overflow-hidden bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <section className="flex h-full w-full max-w-97.5 flex-col overflow-hidden text-left">
        {/* ===== Scanner con cámara ===== */}
        <div
          data-pencil-name="Camera"
          className="relative box-border w-full flex-1 min-h-0 overflow-hidden bg-black"
        >
          {/* Video de la cámara trasera (reemplaza el gradiente) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
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
              onClick={() => navigate("/inventory")}
              className="box-border size-8.5 shrink-0 cursor-pointer rounded-[17px] bg-[#FFFFFF14] flex items-center justify-center"
            >
              <ArrowLeft className="size-4 shrink-0 text-white" />
            </button>
          </div>

          {/* Scan Frame centrado — se mantiene con sus barras */}
          <div className="absolute inset-0 z-2 flex items-center justify-center">
            <div className="relative h-32.5 w-full max-w-64.5">
              <div className="absolute -left-1.5 -top-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:3px_0_0_3px]" />
              <div className="absolute -right-1.5 -top-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:3px_3px_0_0]" />
              <div className="absolute -bottom-1.5 -left-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:0_0_3px_3px]" />
              <div className="absolute -bottom-1.5 -right-1.5 box-content h-[26.5px] w-[26.5px] border-solid border-[#D9F36A] [border-width:0_3px_3px_0]" />
            </div>
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
          className="box-border flex w-full shrink-0 flex-col items-start justify-start gap-3 rounded-t-3xl bg-[#FFFFFF] px-4.5 pt-2.5 pb-5 [box-shadow:0px_-20px_60px_#13362633]"
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
                inputMode="numeric"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ""))}
                className="m-0 h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-left text-[11.5px]/[normal] font-[Inter,system-ui,sans-serif] font-semibold tracking-[0.4px] text-[#17221D] outline-none"
              />
              <div className="flex h-fit w-fit shrink-0 flex-row items-center justify-start gap-0 rounded-full bg-[#EAF2DF] p-[3px_8px]">
                <div className="box-border text-left text-[7.5px]/[normal] font-[Inter,system-ui,sans-serif] font-bold whitespace-nowrap text-[#104B37]">
                  Escaneado
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
                  value={price}
                  onChange={(e) => {
                    const clean = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1");
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
                  value={stock}
                  onChange={(e) => setStock(e.target.value.replace(/\D/g, ""))}
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
            className="flex h-12 w-full shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-[#176B4D] transition-colors hover:bg-[#104B37] [box-shadow:0px_10px_24px_#176B4D33]"
          >
            <Plus className="size-4 shrink-0 text-white" />
            <span className="box-border text-left text-[12.5px]/[normal] font-[Inter,system-ui,sans-serif] font-bold whitespace-nowrap text-white">
              Agregar producto
            </span>
          </button>
        </form>
      </section>
    </div>
  );
}