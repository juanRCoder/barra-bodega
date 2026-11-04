import { ChevronRight } from 'lucide-react';
import type { ClientData } from '@/types/account.type';
import { useNavigate } from 'react-router-dom';

type ClientCardProps = {
  client: ClientData;
};

export const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();

  const isDebt = client.status === 'debt';

  return (
    <div
      onClick={() => navigate(`/accounts/${client.id}`)}
      className="box-border w-full shrink-0 flex flex-col gap-1.75 p-3.25 justify-start items-start bg-[#FFFFFF] border border-[#E4E9DF] rounded-2xl cursor-pointer hover:bg-[#F7F8F2] transition-colors"
    >
      <div className="box-border w-full h-fit shrink-0 flex flex-row gap-2.5 justify-start items-center flex-wrap">
        <div
          className={`box-border w-8.5 shrink-0 h-8.5 flex flex-row gap-0 justify-center items-center rounded-full ${client.avatarBg}`}
        >
          <div
            className={`text-[9.5px]/[normal] box-border ${client.avatarText} font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap`}
          >
            {client.initials}
          </div>
        </div>
        <div className="box-border flex-1 h-fit flex flex-col gap-px justify-start items-start min-w-0">
          <div className="text-[12px]/[normal] box-border text-[#17221D] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap truncate w-full">
            {client.name}
          </div>
          <div className="text-[9px]/[normal] box-border text-[#65736B] font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap truncate w-full">
            {client.phone}
          </div>
        </div>
        <div className="box-border w-fit shrink-0 h-fit flex flex-col gap-0.5 justify-start items-end">
          <div
            className={`text-[12.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-normal text-left whitespace-nowrap ${isDebt ? 'text-[#B5392B]' : 'text-[#176B4D]'}`}
          >
            {client.amount}
          </div>
          <div
            className={`box-border w-fit h-fit shrink-0 flex flex-row gap-0 px-1.75 py-0.5 justify-start items-center rounded-full ${isDebt ? 'bg-[#FBEAE6]' : 'bg-[#EAF2DF]'}`}
          >
            <div
              className={`text-[7.5px]/[normal] box-border font-[Inter,system-ui,sans-serif] font-bold text-left whitespace-nowrap ${isDebt ? 'text-[#B5392B]' : 'text-[#104B37]'}`}
            >
              {isDebt ? 'Con deuda' : 'Saldado'}
            </div>
          </div>
        </div>
        <ChevronRight className="box-border size-3.25 shrink-0 text-[#65736B]" />
      </div>
    </div>
  );
};
