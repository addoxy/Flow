'use client';

import { Button } from '@/components/ui/button';
import { useDurationStore } from '@/lib/hooks/use-duration-store';

type DurationButtonProps = {
  duration: number;
};

const DurationButton = (props: DurationButtonProps) => {
  const { duration } = props;
  const setDuration = useDurationStore((state) => state.setDuration);

  return (
    <Button onClick={() => setDuration(duration)} variant="secondary">
      {duration} mins
    </Button>
  );
};

export default DurationButton;
