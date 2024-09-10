'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDurationStore } from '@/lib/hooks/use-duration-store';
import { useDurationTracker } from '@/lib/hooks/use-duration-tracker';
import { cn } from '@/lib/utils';
import { PauseIcon, PlayIcon, RefreshCcwIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const Timer = () => {
  const { duration, isLoading } = useDurationTracker();
  const toggleTimer = useDurationStore((state) => state.togglePause);
  const resetTimer = useDurationStore((state) => state.resetDuration);
  const isTimerPaused = useDurationStore((state) => state.isPaused);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Timer</CardTitle>
          <ThemeMenu className="animate-transition opacity-0 group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent className="mt-8 flex flex-col items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-[72px] w-52 rounded-md" />
        ) : (
          <span className="text-7xl font-bold">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        )}
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={toggleTimer} size="icon" variant="ghost">
            {isTimerPaused ? (
              <>
                <PlayIcon className="h-5 w-5" />
                <span className="sr-only">Start</span>
              </>
            ) : (
              <>
                <PauseIcon className="h-5 w-5" />
                <span className="sr-only">Pause</span>
              </>
            )}
          </Button>
          <Button onClick={resetTimer} size="icon" variant="ghost">
            <RefreshCcwIcon className="h-5 w-5" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="mt-8 flex items-center justify-between gap-2">
        <DurationSelector className="animate-transition opacity-0 group-hover:opacity-100" />
      </CardFooter>
    </Card>
  );
};

const ALLOWED_DURATIONS = [15, 25, 30, 45, 60, 90, 120];

const DurationSelector = ({ className }: { className?: string }) => {
  const setDuration = useDurationStore((state) => state.setDuration);
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('flex w-full flex-col', className, open && 'opacity-100')}>
      <span className="mb-2 text-sm">Work duration</span>
      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={(value) => setDuration(parseInt(value.split(' ')[0]))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a work duration" />
        </SelectTrigger>
        <SelectContent>
          {ALLOWED_DURATIONS.map((allowedDuration) => (
            <SelectItem value={allowedDuration + ' minutes'}>{allowedDuration} minutes</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const THEMES = ['light', 'dark', 'rose', 'orange', 'blue', 'yellow', 'violet'];

const ThemeMenu = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn('gap-2 capitalize data-[state=open]:opacity-100', className)}
        >
          <div
            className={cn(
              'size-4 rounded',
              theme === 'light' && 'bg-zinc-300',
              theme === 'dark' && 'bg-zinc-700',
              theme === 'rose' && 'bg-rose-500',
              theme === 'orange' && 'bg-orange-500',
              theme === 'blue' && 'bg-blue-500',
              theme === 'yellow' && 'bg-yellow-500',
              theme === 'violet' && 'bg-violet-500'
            )}
          />
          {theme}
          <span className="sr-only">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((theme) => (
          <ThemeMenuItem key={theme} theme={theme} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type ThemeMenuItemProps = {
  theme: string;
};

const ThemeMenuItem = (props: ThemeMenuItemProps) => {
  const { theme } = props;
  const { setTheme } = useTheme();

  return (
    <DropdownMenuItem
      onSelect={() => setTheme(theme)}
      className="flex cursor-pointer items-center gap-2"
    >
      <div
        className={cn(
          'size-4 rounded hover:bg-current',
          theme === 'light' && 'bg-zinc-300',
          theme === 'dark' && 'bg-zinc-700',
          theme === 'rose' && 'bg-rose-500',
          theme === 'orange' && 'bg-orange-500',
          theme === 'blue' && 'bg-blue-500',
          theme === 'yellow' && 'bg-yellow-500',
          theme === 'violet' && 'bg-violet-500'
        )}
      />
      <span className="capitalize">{theme}</span>
    </DropdownMenuItem>
  );
};

export default Timer;
