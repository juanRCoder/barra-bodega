import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Store,
  User,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuthMutations';

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      businessName: '',
      email: '',
      phone: '',
      password: '',
      showPassword: false,
    },
  });
  const showPassword = useWatch({ control, name: 'showPassword' });
  const registration = useRegister();

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
          className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.75 px-0 py-3"
        >
          <h1
            data-pencil-name="Title"
            className="box-border text-left text-[27px]/[28px] font-normal text-[#17221D]"
          >
            Crea tu cuenta
          </h1>
          <p
            data-pencil-name="Sub"
            className="box-border text-left text-[11.5px]/[17px] font-normal text-[#65736B]"
          >
            Gratis, sin tarjeta. En dos minutos ya puedes registrar tu primera
            venta.
          </p>
        </div>

        {/* Form Card */}
        <form
          data-pencil-name="Form Card"
          onSubmit={handleSubmit((values) =>
            registration.mutate(values, { onSuccess: () => navigate('/') })
          )}
          className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-3.25 rounded-[20px] bg-white p-4"
        >
          {/* Nombre y apellido */}
          <div
            data-pencil-name="Field Nombre y apellido"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="fullName"
              data-pencil-name="Label"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
            >
              Nombre y apellido
            </label>
            <div className="relative w-full">
              <User
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-[#65736b]"
              />
              <Input
                id="fullName"
                {...register('name')}
                type="text"
                autoComplete="name"
                placeholder="Rosa Pérez"
                aria-invalid={Boolean(errors.name)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-[#B5392B]" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Nombre de tu tienda */}
          <div
            data-pencil-name="Field Nombre de tu tienda"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="storeName"
              data-pencil-name="Label"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
            >
              Nombre de tu tienda
            </label>
            <div className="relative w-full">
              <Store
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-[#65736b]"
              />
              <Input
                id="storeName"
                {...register('businessName')}
                type="text"
                autoComplete="organization"
                placeholder="Bodega Doña Rosa"
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
            </div>
          </div>

          {/* Correo */}
          <div
            data-pencil-name="Field Correo"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="email"
              data-pencil-name="Label"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
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
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="rosa@gmail.com"
                aria-invalid={Boolean(errors.email)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#B5392B]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div
            data-pencil-name="Field Teléfono"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="phone"
              data-pencil-name="Label"
              className="whitespace-nowrap text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
            >
              Teléfono
            </label>
            <div className="relative w-full">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-3.75 -translate-y-1/2 text-[#65736b]"
              />
              {/* Prefix +51 fijo, solapado al inicio del input */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-9 -translate-y-1/2 text-[12px] font-semibold text-[#65736B]"
              >
                +51
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-16 h-4 w-px -translate-y-1/2 bg-[#E4E9DF]"
              />
              <Input
                id="phone"
                {...register('phone')}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="987 654 321"
                aria-invalid={Boolean(errors.phone)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pl-19 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-[#B5392B]" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div
            data-pencil-name="Field Contraseña"
            className="box-border flex h-fit w-full shrink-0 flex-col items-start justify-start gap-1.5"
          >
            <label
              htmlFor="password"
              data-pencil-name="Label"
              className="text-left text-[10.5px]/[normal] font-semibold text-[#65736B]"
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
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                className="h-11 rounded-[12px] border-[#E4E9DF] bg-white pr-10 pl-9 text-[12px] text-[#17221D] placeholder:text-[#65736B] focus-visible:border-[#176B4D] focus-visible:ring-[#176B4D]/20"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-[#B5392B]" role="alert">
                  {errors.password.message}
                </p>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  setValue('showPassword', !showPassword, {
                    shouldDirty: true,
                  })
                }
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

          {/* Primary Button */}
          <Button
            type="submit"
            disabled={registration.isPending}
            data-pencil-name="Primary Button"
            className="box-border h-12 w-full shrink-0 gap-2 rounded-[999px] bg-[#176B4D] text-[12.5px]/[normal] font-bold text-white hover:bg-[#12553D] focus-visible:ring-3 focus-visible:ring-[#176B4D]/30"
          >
            {registration.isPending ? 'Creando cuenta...' : 'Crear mi cuenta'}
            <ArrowRight className="size-3.75 text-white" />
          </Button>
          {registration.error && (
            <p
              className="w-full text-center text-xs text-[#B5392B]"
              role="alert"
            >
              {registration.error.message}
            </p>
          )}
        </form>

        {/* Switch */}
        <div
          data-pencil-name="Switch"
          className="box-border flex h-fit w-full shrink-0 flex-row items-center justify-center gap-1.25"
        >
          <span
            data-pencil-name="Q"
            className="text-left text-[11px]/[normal] font-normal text-[#65736B]"
          >
            ¿Ya tienes cuenta?
          </span>
          <Button
            type="button"
            variant="link"
            onClick={() => navigate('/auth/login')}
            data-pencil-name="A"
            className="h-auto cursor-pointer p-0 text-left text-[11px]/[normal] font-normal text-[#176B4D] no-underline hover:text-[#12553D] hover:underline"
          >
            Inicia sesión
          </Button>
        </div>
      </section>
    </div>
  );
}
