import PrayerTimesWidget from '../components/dashboard/PrayerTimesWidget';
import QuickAccess from '../components/dashboard/QuickAccess';
import MemorizationProgress from '../components/dashboard/MemorizationProgress';
import LastReadSection from '../components/dashboard/LastReadSection';

const Dashboard = () => {
  return (
    <section className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">مرحباً بك في تطبيق القرآن الكريم التعليمي</h2>
        
        <PrayerTimesWidget />
        <QuickAccess />
        <MemorizationProgress />
        <LastReadSection />
      </div>
    </section>
  );
};

export default Dashboard;
