import { ArrowRight, Eye, Lock, Mail, Phone, Store, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  return (
    <div
      className="flex min-h-screen w-full justify-center bg-[#F7F8F2] text-[#17221D]"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <section className="flex w-full max-w-97.5 flex-col gap-3 p-3 text-left">
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

        <div
          data-pencil-name="Hero"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-1.75 px-0 py-3 justify-start items-start"
        >
          <div
            data-pencil-name="Title"
            className="text-[27px]/[28px] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left"
          >
            Crea tu cuenta
          </div>
          <div
            data-pencil-name="Sub"
            className="text-[11.5px]/[17px] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left"
          >
            Gratis, sin tarjeta. En dos minutos ya puedes registrar tu primera
            venta.
          </div>
        </div>

        <div
          data-pencil-name="Form Card"
          className="box-border w-full h-fit shrink-0 flex flex-col gap-3.25 p-4 justify-start items-start bg-[#FFFFFF] rounded-[20px]"
        >
          <div
            data-pencil-name="Field Nombre y apellido"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
          >
            <div
              data-pencil-name="Label"
              className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              Nombre y apellido
            </div>
            <div
              data-pencil-name="Input"
              className="box-border w-full h-11 shrink-0 flex flex-row gap-2 p-[0px_12px] justify-start items-center bg-[#FFFFFF] [border:1px_solid_#E4E9DF] rounded-[12px]"
            >
              <User className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
              <div
                data-pencil-name="Value"
                className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                Rosa Pérez
              </div>
            </div>
          </div>
          <div
            data-pencil-name="Field Nombre de tu tienda"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
          >
            <div
              data-pencil-name="Label"
              className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              Nombre de tu tienda
            </div>
            <div
              data-pencil-name="Input"
              className="box-border w-full h-11 shrink-0 flex flex-row gap-2 p-[0px_12px] justify-start items-center bg-[#FFFFFF] [border:1px_solid_#E4E9DF] rounded-[12px]"
            >
              <Store className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
              <div
                data-pencil-name="Value"
                className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                Bodega Doña Rosa
              </div>
            </div>
          </div>
          <div
            data-pencil-name="Field Correo"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
          >
            <div
              data-pencil-name="Label"
              className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              Correo
            </div>
            <div
              data-pencil-name="Input"
              className="box-border w-full h-11 shrink-0 flex flex-row gap-2 p-[0px_12px] justify-start items-center bg-[#FFFFFF] [border:1px_solid_#E4E9DF] rounded-[12px]"
            >
              <Mail className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
              <div
                data-pencil-name="Value"
                className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap"
              >
                rosa@gmail.com
              </div>
            </div>
          </div>
          <div
            data-pencil-name="Field Teléfono"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
          >
            <div
              data-pencil-name="Label"
              className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
            >
              Teléfono
            </div>
            <div
              data-pencil-name="Input"
              className="box-border w-full h-11 shrink-0 flex flex-row gap-2 p-[0px_12px] justify-start items-center bg-[#FFFFFF] [border:1px_solid_#E4E9DF] rounded-[12px]"
            >
              <Phone className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
              <div
                data-pencil-name="Prefix"
                className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left whitespace-nowrap"
              >
                +51
              </div>
              <div
                data-pencil-name="Divider"
                className="box-border w-px shrink-0 h-4 flex flex-row gap-0 justify-start items-start bg-[#E4E9DF]"
              ></div>
              <div
                data-pencil-name="Value"
                className="text-[12px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left"
              >
                987 654 321
              </div>
            </div>
          </div>
          <div
            data-pencil-name="Field Contraseña"
            className="box-border w-full h-fit shrink-0 flex flex-col gap-1.5 justify-start items-start"
          >
            <div
              data-pencil-name="Label"
              className="text-[10.5px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-semibold text-left"
            >
              Contraseña
            </div>
            <div
              data-pencil-name="Input"
              className="box-border w-full h-11 shrink-0 flex flex-row gap-2 p-[0px_12px] justify-start items-center bg-[#FFFFFF] [border:1px_solid_#E4E9DF] rounded-[12px]"
            >
              <Lock className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
              <div
                data-pencil-name="Value"
                className="text-[12px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left"
              >
                ••••••••
              </div>
              <div
                data-pencil-name="Spacer"
                className="box-border flex-[1_1_0] h-px flex flex-row gap-0 justify-start items-start"
              />
              <Eye className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-[#65736b]" />
            </div>
          </div>
          <div
            data-pencil-name="Primary Button"
            className="box-border w-full h-12 shrink-0 flex flex-row gap-2 justify-center items-center bg-[#176B4D] rounded-[999px]"
          >
            <div
              data-pencil-name="Label"
              className="text-[12.5px]/[normal] box-border text-[#FFFFFF] font-[Inter,system-ui,sans-serif] font-bold text-left"
            >
              Crear mi cuenta
            </div>
            <ArrowRight className="box-border w-3.75 shrink-0 h-3.75 overflow-visible text-white" />
          </div>
        </div>

        <div
          data-pencil-name="Switch"
          className="box-border w-full h-fit shrink-0 flex flex-row gap-1.25 justify-center items-center"
        >
          <div
            data-pencil-name="Q"
            className="text-[11px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left"
          >
            ¿Ya tienes cuenta?
          </div>
          <div
            onClick={() => navigate('/auth/login')}
            data-pencil-name="A"
            className="hover:underline cursor-pointer text-[11px]/[normal] box-border text-[#176B4D] font-[Inter,system-ui,sans-serif] font-normal text-left"
          >
            Inicia sesión
          </div>
        </div>
      </section>
    </div>
  );
}
