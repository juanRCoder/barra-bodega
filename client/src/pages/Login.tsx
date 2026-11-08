import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: call auth API
    console.log({ email, password });
  }

  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
        {/* Top Bar */}
        <div
          data-pencil-name="Top Bar"
          className="box-border flex h-8 w-full shrink-0 items-center justify-between"
        >
          <div className="flex items-center gap-2.25">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[9px] bg-[#D9F36A]">
              <span className="text-[20px] font-bold text-[#104B37]">▥</span>
            </div>
            <div
              data-pencil-name="Name"
              className="whitespace-nowrap text-left text-[14.5px]/[normal] font-normal tracking-[-0.5px] text-[#17221D]"
            >
              BarraBodega
            </div>
          </div>
        </div>

        {/* Hero */}
        <div
          data-pencil-name="Hero"
          className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.75 px-0 py-4"
        >
          <h1
            data-pencil-name="Title"
            className="box-border text-left text-[27px]/[28px] font-normal text-[#17221D]"
          >
            Inicia Sesión
          </h1>
          <p
            data-pencil-name="Sub"
            className="box-border text-left text-[11.5px]/[17px] font-normal text-[#65736B]"
          >
            Entra para ver cómo va tu bodega hoy.
          </p>
        </div>

        {/* Form Card */}
        <form
          data-pencil-name="Form Card"
          onSubmit={handleSubmit}
          className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-3.25 rounded-[20px] bg-white p-4"
        >
          {/* Email */}
          <div
            data-pencil-name="Field Correo"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="email"
              data-pencil-name="Label"
              className="box-border text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
            >
              Correo
            </label>
            <div className="relative w-full">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-[#65736b]"
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="rosa@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
            </div>
          </div>

          {/* Password */}
          <div
            data-pencil-name="Field Contraseña"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="password"
              data-pencil-name="Label"
              className="box-border text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
            >
              Contraseña
            </label>
            <div className="relative w-full">
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-[#65736b]"
              />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pr-9 pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                }
                className="absolute right-1 top-2.5 cursor-pointer text-[#65736b] hover:bg-transparent hover:text-[#176B4D]"
              >
                {showPassword ? (
                  <Eye className="size-3.75" />
                ) : (
                  <EyeOff className="size-3.75" />
                )}
              </Button>
            </div>
          </div>

          {/* Forgot */}
          <div
            data-pencil-name="Remember Row"
            className="box-border flex h-fit w-full shrink-0 flex-row items-center justify-between p-[2px_0px]"
          >
            <a
              href="/forgot-password"
              data-pencil-name="Forgot"
              className="text-left text-[10.5px]/[normal] font-normal text-[#176B4D] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Primary Button */}
          <Button
            type="submit"
            data-pencil-name="Primary Button"
            className="cursor-pointer box-border h-12 w-full shrink-0 gap-2 rounded-[999px] bg-[#176B4D] text-[12.5px]/[normal] font-bold text-white hover:bg-[#12553D] focus-visible:ring-3 focus-visible:ring-[#176B4D]/30"
          >
            Iniciar sesión
            <ArrowRight className="size-3.75 text-white" />
          </Button>
        </form>

        {/* Support Row */}
        <div
          data-pencil-name="Support Row"
          className="box-border flex h-fit shrink-0 cursor-pointer flex-row items-center justify-center gap-1.5 hover:underline"
        >
          <MessageCircle className="size-3 text-[#65736b]" />
          <span
            data-pencil-name="Text"
            className="text-left text-[10.5px]/[normal] font-normal text-[#65736B]"
          >
            ¿Problemas para entrar? Escríbenos
          </span>
        </div>
      </section>
    </div>
  );
}
