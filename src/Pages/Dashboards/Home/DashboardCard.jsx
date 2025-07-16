import { ChartSpline, Gift, PillBottle, Users } from "lucide-react";

const DashboardCard = () => {
  

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="p-6 rounded-lg shadow-sm bg-[#F2F5EF] border border-[#DBDADA]">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total User</p>
            <p className="text-3xl font-bold mt-1 text-[#B8860B]">123</p>
            <p className="text-xs mt-1 opacity-70 text-[#22C55E]">+12% from last month</p>
          </div>
          <Users className='w-8 h-8 text-[#B8860B]'/>
        </div>
      </div>
      <div className="p-6 rounded-lg shadow-sm bg-[#F1EBE8] border border-[#DBDADA]">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total Casks</p>
            <p className="text-3xl font-bold mt-1 text-[#C35E40]">223</p>
            <p className="text-xs mt-1 opacity-70 text-[#22C55E]">+2% from last month</p>
          </div>
          <PillBottle className='w-8 h-8 text-[#C35E40]'/>
        </div>
      </div>
      <div className="p-6 rounded-lg shadow-sm bg-[#ECF1EA] border border-[#DBDADA]">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Active Offers</p>
            <p className="text-3xl font-bold mt-1 text-[#909451]">123</p>
            <p className="text-xs mt-1 opacity-70 text-[#B8700B]">3 expiring month</p>
          </div>
          <Gift className='w-8 h-8 text-[#909451]'/>
        </div>
      </div>
      <div className='p-6 rounded-lg shadow-sm bg-[#E1F6EB] border border-[#DBDADA]'>
      <div className="flex items-center justify-center gap-7">
        <div className="text-center">
          <p className='text-sm font-medium opacity-80'>Total Value</p>
          <p className='text-3xl font-bold mt-1 text-[#22C55E]'>$12.3M</p>
          <p className='text-xs mt-1 opacity-70 text-[#22C55E]'>+12% from last month</p>
        </div>
        <ChartSpline className='w-8 h-8 text-[#22C55E]'/>
      </div>
    </div>
    </div>
  );
};

export default DashboardCard;
