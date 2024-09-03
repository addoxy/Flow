import PageWrapper from '@/components/page-wrapper';
import DurationButton from './duration-button';
import Timer from './timer';

const DURATIONS = [30, 45, 60, 90, 120];

const TimerPage = () => {
  return (
    <PageWrapper className="flex min-h-screen flex-col items-center justify-center">
      <Timer className="mb-5" />
      <div className="flex items-center gap-3">
        {DURATIONS.map((duration) => (
          <DurationButton duration={duration} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default TimerPage;
