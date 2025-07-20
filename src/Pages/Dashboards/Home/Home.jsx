import DashboardCard from './DashboardCard';
import RecentUser from './RecentUser';
import GrowthOverviewChart from './GrowthOverviewChart';
import UserActivityChart from './UserActivityChart';

const Home = () => {
    return (
         <div>
            <DashboardCard/>
            <div className="py-10 grid grid-cols-3 gap-7">
                <div className='col-span-2'>
                    <GrowthOverviewChart/>
                </div>
                <div className='col-span-1'>
                    <UserActivityChart/>
                </div>
            </div>
            <RecentUser/>
        </div>
    );
};

export default Home;