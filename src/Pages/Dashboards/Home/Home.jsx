import DashboardCard from './DashboardCard';
import RecentUser from './RecentUser';
import WeeklyActivity from './WeeklyActivity';
import RecentToken from './RecentToken';

const Home = () => {
    return (
         <div>
            <DashboardCard/>
            <div className="py-10 grid grid-cols-3 gap-7">
                <div className='col-span-1'>
                    <WeeklyActivity/>
                </div>
                <div className='col-span-2'>
                    <RecentToken/>
                </div>
            </div>
            <RecentUser/>
        </div>
    );
};

export default Home;