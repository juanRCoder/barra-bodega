import type { NewAccountForm } from '@/types/account.type';
import { Phone, Plus, User, UserPlus, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useCreateAccount } from '@/hooks/useAccounts';
import { AccountsApiError } from '@/services/accounts.service';
import { Button } from '@/components/ui/button';

const INITIAL_FORM: NewAccountForm = { name: '', phone: '' };

/** Agrupa 987654321 -> "987 654 321" */
const formatPhone = (raw: string) =>
  raw
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');

export const NewAccount = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<NewAccountForm>(INITIAL_FORM);
  const createAccountMutation = useCreateAccount();

  const close = () => setIsOpen(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAccountMutation.mutate(
      { name: form.name.trim(), phone: form.phone.replace(/\D/g, '') },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          close();
        },
      }
    );
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        onClick={() => {
          createAccountMutation.reset();
          setIsOpen(true);
        }}
        className="box-border w-fit shrink-0 h-8.5 rounded-full bg-[#176B4D] px-3 gap-1.5 text-white hover:bg-[#104B37] text-[11px]/[normal] cursor-pointer"
      >
        <Plus data-icon="inline-start" />
        Nuevo
      </Button>
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
          data-pencil-name="Nueva cuenta Sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-account-title"
          className="box-border w-full sm:w-97.5 [box-shadow:0px_-20px_60px_#13362633] absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col gap-3 px-4.5 pt-2.5 pb-5 justify-start items-start bg-white rounded-t-3xl rounded-b-none z-10"
        >
          <div
            data-pencil-name="Handle"
            className="box-border w-full h-1 shrink-0 flex flex-row gap-0 justify-center items-start"
          >
            <div
              data-pencil-name="Bar"
              className="box-border w-9 shrink-0 h-1 flex flex-row gap-0 justify-start items-start bg-[#E4E9DF] rounded-full"
            />
          </div>

          <div
            data-pencil-name="Header"
            className="box-border w-full h-fit shrink-0 flex flex-row gap-0 justify-between items-center"
          >
            <h2
              id="new-account-title"
              data-pencil-name="Title"
              className="text-[18px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal tracking-[-0.6px] text-left whitespace-nowrap m-0"
            >
              Nueva cuenta
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              data-pencil-name="Close"
              className="box-border size-7 shrink-0 flex flex-row gap-0 justify-center items-center bg-[#F7F8F2] rounded-[14px] cursor-pointer hover:bg-[#E4E9DF] transition-colors"
            >
              <X className="box-border size-3.5 shrink-0 text-[#65736B]" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="box-border w-full flex flex-col gap-3"
          >
            {/* Name */}
            <div
              data-pencil-name="Name Field"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-1.25 justify-start items-start"
            >
              <label
                htmlFor="customer-name"
                data-pencil-name="Label"
                className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
              >
                Nombre
              </label>
              <div
                data-pencil-name="Input"
                className="box-border w-full h-11 shrink-0 flex flex-row gap-2 px-3 justify-start items-center bg-white outline outline-[#E4E9DF] outline-offset-[-0.5px] rounded-xl focus-within:outline-[#176B4D] focus-within:outline-[1.5px]"
              >
                <User className="box-border size-3.5 shrink-0 text-[#65736B]" />
                <input
                  id="customer-name"
                  name="customerName"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Ej. Rosa Pérez"
                  autoComplete="name"
                  className="box-border flex-1 h-full min-w-0 bg-transparent border-0 outline-none text-[12px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left placeholder:text-[#65736B] placeholder:font-normal placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div
              data-pencil-name="Phone Field"
              className="box-border w-full h-fit shrink-0 flex flex-col gap-1.25 justify-start items-start"
            >
              <label
                htmlFor="customer-phone"
                data-pencil-name="Label"
                className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
              >
                Número de teléfono
              </label>
              <div
                data-pencil-name="Input"
                className="box-border w-full h-11 shrink-0 flex flex-row gap-2 px-3 justify-start items-center bg-white outline outline-[#E4E9DF] outline-offset-[-0.5px] rounded-xl focus-within:outline-[#176B4D] focus-within:outline-[1.5px]"
              >
                <Phone className="size-3.75 shrink-0 text-[#65736B]" />
                <span
                  data-pencil-name="Prefix"
                  className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
                >
                  +51
                </span>
                <div
                  data-pencil-name="Divider"
                  className="box-border w-px shrink-0 h-4 flex flex-row gap-0 justify-start items-start bg-[#E4E9DF]"
                />
                <input
                  id="customer-phone"
                  name="customerPhone"
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel-national"
                  placeholder="987 654 321"
                  maxLength={11}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: formatPhone(e.target.value),
                    }))
                  }
                  className="box-border flex-1 h-full min-w-0 bg-transparent border-0 outline-none text-[12px]/[normal] text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left placeholder:text-[#65736B] placeholder:font-normal placeholder:opacity-100"
                />
              </div>
            </div>

            <button
              type="submit"
              data-pencil-name="Register"
              disabled={createAccountMutation.isPending}
              className="box-border w-full h-12 shrink-0 [box-shadow:0px_10px_24px_#176B4D33] flex flex-row gap-2 justify-center items-center bg-[#176B4D] rounded-full cursor-pointer hover:bg-[#104B37] transition-colors"
            >
              <UserPlus className="size-4 text-white" />
              <span
                data-pencil-name="Label"
                className="text-[12.5px]/[normal] box-border text-white font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap"
              >
                {createAccountMutation.isPending ? 'Registrando…' : 'Registrar'}
              </span>
            </button>
            {createAccountMutation.isError && (
              <p className="m-0 text-[11px] text-[#B5392B]" role="alert">
                {createAccountMutation.error instanceof AccountsApiError
                  ? createAccountMutation.error.message
                  : 'No se pudo registrar la cuenta. Intenta nuevamente.'}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
