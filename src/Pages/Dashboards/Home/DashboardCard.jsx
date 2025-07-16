import { ChartSpline, Gift, PillBottle, Users } from "lucide-react";

const DashboardCard = () => {
  

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="p-6 rounded-lg shadow-sm bg-[#F2F5EF]">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total User</p>
            <p className="text-3xl font-bold mt-1 text-[#B8860B]">123</p>
            <p className="text-xs mt-1 opacity-70 text-[#22C55E]">+12% from last month</p>
          </div>
          <Users className='w-8 h-8 text-[#B8860B]'/>
        </div>
      </div>
      <div className="p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Total Casks</p>
            <p className="text-3xl font-bold mt-1 text-[#C35E40-]">223</p>
            <p className="text-xs mt-1 opacity-70 text-[#22C55E]">+2% from last month</p>
          </div>
          <PillBottle className='w-8 h-8'/>
        </div>
      </div>
      <div className="p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-center gap-7">
          <div className="text-center">
            <p className="text-sm font-medium opacity-80">Active Offers</p>
            <p className="text-3xl font-bold mt-1">123</p>
            <p className="text-xs mt-1 opacity-70">3 expiring month</p>
          </div>
          <Gift className='w-8 h-8'/>
        </div>
      </div>
      <div className='p-6 rounded-lg shadow-sm'>
      <div className="flex items-center justify-center gap-7">
        <div className="text-center">
          <p className='text-sm font-medium opacity-80'>Total Value</p>
          <p className='text-3xl font-bold mt-1'>$12.3M</p>
          <p className='text-xs mt-1 opacity-70'>+12% from last month</p>
        </div>
        <ChartSpline className='w-8 h-8'/>
      </div>
    </div>
    </div>
  );
};

export default DashboardCard;
