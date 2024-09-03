'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useDurationTracker } from '@/lib/hooks/use-duration-tracker';
import { cn } from '@/lib/utils';

type TimerProps = {
  className?: string;
};

const Timer = (props: TimerProps) => {
  const { duration, isLoading } = useDurationTracker();

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  if (isLoading) {
    return <Skeleton className={cn('h-[72px] w-40', props.className)} />;
  }

  return (
    <span className={cn('text-7xl font-medium', props.className)}>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
};

export default Timer;
