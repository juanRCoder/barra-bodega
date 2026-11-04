import { Check, Pencil, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type props = {
  productName: string;
  initialPrice?: number;
  initialStock?: number;
};

export const UpdateProduct = ({
  productName,
  initialPrice = 7.0,
  initialStock = 24,
}: props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(initialPrice.toFixed(2));
  const [stock, setStock] = useState(String(initialStock));

  const close = () => setIsOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      productName,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
    };
    console.log(payload);
    // TODO: llamar API
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Editar ${productName}`}
        className="box-border size-6.5 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] border border-[#E4E9DF] rounded-[13px] hover:bg-[#E4E9DF] transition-colors cursor-pointer"
      >
        <Pencil className="box-border size-3.5 shrink-0 text-[#176B4D]" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        role="presentation"
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={close}
          aria-hidden="true"
        />

        <div
          data-pencil-name="Editar precio y stock Sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-product-title"
          className="box-border w-full sm:w-97.5 [box-shadow:0px_-20px_60px_#13362633] absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col gap-3 px-4.5 pt-2.5 pb-5 justify-start items-start bg-white rounded-t-3xl rounded-b-none z-10"
        >
          <div
            data-pencil-name="Handle"
            className="box-border w-full h-1 shrink-0 flex flex-row gap-0 justify-center items-start"
          >
            <div className="box-border w-9 shrink-0 h-1 flex flex-row gap-0 justify-start items-start bg-[#E4E9DF] rounded-full" />
          </div>

          <div
            data-pencil-name="Header"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          >
            <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-px justify-start items-start">
              <h2
                id="edit-product-title"
                data-pencil-name="Title"
                className="text-[17px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.5px] text-left whitespace-nowrap m-0"
              >
                Editar precio y stock
              </h2>
              <div
                data-pencil-name="Product"
                className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                {productName}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              data-pencil-name="Close"
              className="box-border w-7 h-7 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] rounded-[14px] cursor-pointer hover:bg-[#E4E9DF] transition-colors"
            >
              <X className="box-border size-3.5 shrink-0 text-[#65736B]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="box-border w-full flex flex-col gap-3">
            <div
              data-pencil-name="Fields"
              className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-start"
            >
              {/* Price Field */}
              <div
                data-pencil-name="Price Field"
                className="box-border flex-1 min-w-0 h-fit flex flex-col gap-1.25 justify-start items-start"
              >
                <label
                  htmlFor="product-price"
                  data-pencil-name="Label"
                  className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
                >
                  Precio
                </label>
                <div
                  data-pencil-name="Input"
                  className="box-border w-full h-11.5 shrink-0 flex flex-row gap-2 px-3 py-0 justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-xl transition-[outline-color,outline-width] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]"
                >
                  <span className="text-base/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap select-none">
                    S/
                  </span>
                  <input
                    id="product-price"
                    name="price"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    required
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
                    className="box-border flex-1 min-w-0 h-full bg-transparent border-0 outline-none p-0 m-0 text-base/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.3px] text-left placeholder:text-[#B7C0BA]"
                  />
                  <span
                    data-pencil-name="Unit"
                    className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap select-none"
                  >
                    unid.
                  </span>
                </div>
              </div>

              {/* Stock Field */}
              <div
                data-pencil-name="Stock Field"
                className="box-border flex-1 min-w-0 h-fit flex flex-col gap-1.25 justify-start items-start"
              >
                <label
                  htmlFor="product-stock"
                  data-pencil-name="Label"
                  className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
                >
                  Stock
                </label>
                <div
                  data-pencil-name="Input"
                  className="box-border w-full h-11.5 shrink-0 flex flex-row gap-2 px-3 py-0 justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-xl transition-[outline-color,outline-width] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]"
                >
                  <input
                    id="product-stock"
                    name="stock"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value.replace(/\D/g, ''))}
                    placeholder="0"
                    className="box-border flex-1 min-w-0 h-full bg-transparent border-0 outline-none p-0 m-0 text-base/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.3px] text-left placeholder:text-[#B7C0BA]"
                  />
                  <span
                    data-pencil-name="Unit"
                    className="text-[8.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap select-none"
                  >
                    unid.
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              data-pencil-name="Save"
              className="box-border w-full h-12 shrink-0 [box-shadow:0px_10px_24px_#176B4D33] flex flex-row gap-2 justify-center items-center bg-[#176B4D] rounded-full cursor-pointer hover:bg-[#104B37] transition-colors"
            >
              <Check className="box-border size-4 shrink-0 text-white" />
              <span
                data-pencil-name="Label"
                className="text-[12.5px]/[normal] box-border text-[#FFFFFF] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap"
              >
                Guardar cambios
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};