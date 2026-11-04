import { Banknote, Check, CreditCard, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

type PaymentMethod = 'cash' | 'yape';

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  Icon: typeof Banknote;
}[] = [
  { id: 'cash', label: 'Efectivo', Icon: Banknote },
  { id: 'yape', label: 'Yape/Plin', Icon: CreditCard },
];

const BALANCE = 24.5;

const formatCurrency = (n: number) => `S/ ${n.toFixed(2)}`;

export const RegisterPayment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<string>(BALANCE.toFixed(2));
  const [method, setMethod] = useState<PaymentMethod>('cash');

  const close = () => setIsOpen(false);

  const numericAmount = parseFloat(amount) || 0;
  const confirmLabel = `Confirmar pago · ${formatCurrency(numericAmount)}`;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      amount: numericAmount,
      method,
      currency: 'PEN',
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
        data-pencil-name="Register Payment"
        className="box-border flex-1 h-10 flex flex-row gap-1.5 justify-center items-center bg-[#176B4D] rounded-full cursor-pointer hover:bg-[#104B37] transition-colors"
      >
        <Check className="box-border size-3.5 shrink-0 text-white" />
        <div
          data-pencil-name="Label"
          className="text-[11px]/[normal] box-border text-white font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap"
        >
          Registrar pago
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
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
          data-pencil-name="Registrar pago Sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-payment-title"
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
                id="register-payment-title"
                data-pencil-name="Title"
                className="text-[17px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.5px] text-left whitespace-nowrap m-0"
              >
                Registrar pago
              </h2>
              <div className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap">
                Rosa Pérez · Saldo actual {formatCurrency(BALANCE)}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              data-pencil-name="Close"
              className="box-border w-7 shrink-0 h-7 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] rounded-[14px] cursor-pointer hover:bg-[#E4E9DF] transition-colors"
            >
              <X className="box-border size-3.5 shrink-0 text-[#65736B]" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="box-border w-full flex flex-col gap-3"
          >
            {/* Amount */}
            <div
              data-pencil-name="Amount"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-1.25 justify-start items-start"
            >
              <label
                htmlFor="payment-amount"
                data-pencil-name="Label"
                className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
              >
                Monto a pagar
              </label>

              <div
                data-pencil-name="Ring"
                className="box-border w-full h-fit shrink-0 flex flex-row gap-0 p-0.5 justify-start items-start bg-transparent rounded-[14px] transition-colors focus-within:bg-[#176B4D22]"
              >
                <div
                  data-pencil-name="Field"
                  className="box-border flex-[1_1_0] h-13 flex flex-row gap-1 p-[0px_13px] justify-start items-center bg-[#FFFFFF] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] rounded-xl transition-[outline-color,outline-width] focus-within:outline-[#176B4D] focus-within:[outline-width:1.5px]"
                >
                  <span className="text-[25px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1px] text-left whitespace-nowrap select-none">
                    S/
                  </span>
                  <input
                    id="payment-amount"
                    name="paymentAmount"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    required
                    value={amount}
                    onChange={(e) => {
                      const clean = e.target.value
                        .replace(/[^\d.]/g, '')
                        .replace(/(\..*)\./g, '$1');
                      setAmount(clean);
                    }}
                    onBlur={(e) => {
                      const n = parseFloat(e.target.value);
                      if (!Number.isNaN(n)) setAmount(n.toFixed(2));
                    }}
                    placeholder="0.00"
                    className="box-border flex-1 min-w-0 h-full bg-transparent border-0 outline-none p-0 m-0 text-[25px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-1px] text-left placeholder:text-[#B7C0BA] placeholder:tracking-[-1px]"
                  />
                </div>
              </div>
            </div>

            {/* Method */}
            <fieldset
              data-pencil-name="Method"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-1.25 justify-start items-start border-0 p-0 m-0"
            >
              <legend
                data-pencil-name="Label"
                className="text-[9.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap p-0"
              >
                Método de pago
              </legend>

              <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2 justify-start items-start">
                {PAYMENT_METHODS.map(({ id, label, Icon }) => {
                  const isActive = method === id;
                  return (
                    <label
                      key={id}
                      data-pencil-name={`Method ${label}`}
                      className={`box-border flex-[1_1_0] h-11.5 flex flex-row gap-1.75 justify-center items-center rounded-xl cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#EAF2DF] [outline:1.5px_solid_#176B4D] [outline-offset:-0.75px]'
                          : 'bg-[#FFFFFF] [outline:1px_solid_#E4E9DF] [outline-offset:-0.5px] hover:bg-[#F7F8F2]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={id}
                        checked={isActive}
                        onChange={() => setMethod(id)}
                        className="sr-only"
                      />
                      <Icon
                        className={`box-border size-3.5 shrink-0 ${
                          isActive ? 'text-[#176B4D]' : 'text-[#65736B]'
                        }`}
                      />
                      <span
                        className={`text-[10px]/[normal] box-border font-[Inter,system-ui,sans-serif] text-left whitespace-nowrap ${
                          isActive
                            ? 'text-[#104B37] font-bold'
                            : 'text-[#65736B] font-normal'
                        }`}
                      >
                        {label}
                      </span>
                      {isActive && (
                        <span
                          data-pencil-name="Check"
                          className="box-border w-4 shrink-0 h-4 flex flex-row gap-0 justify-center items-center bg-[#176B4D] rounded-lg"
                        >
                          <Check className="box-border size-3.5 shrink-0 text-white" />
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {/* Confirm */}
            <button
              type="submit"
              data-pencil-name="Confirm"
              className="box-border w-full h-12 shrink-0 [box-shadow:0px_10px_24px_#176B4D33] flex flex-row gap-1.75 justify-center items-center bg-[#176B4D] rounded-[999px] cursor-pointer hover:bg-[#104B37] transition-colors"
            >
              <Check className="box-border w-3.75 shrink-0 h-3.75 text-[#FFFFFF]" />
              <span
                data-pencil-name="Label"
                className="text-[12px]/[normal] box-border text-[#FFFFFF] font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap"
              >
                {confirmLabel}
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
