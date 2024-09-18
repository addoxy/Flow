'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDurationStore } from '@/lib/hooks/use-duration-store';
import { useDurationTracker } from '@/lib/hooks/use-duration-tracker';
import { cn } from '@/lib/utils';
import { ChevronDown, PauseIcon, PlayIcon, RefreshCcwIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

const Timer = () => {
  const { duration, isLoading } = useDurationTracker();
  const toggleTimer = useDurationStore((state) => state.togglePause);
  const resetTimer = useDurationStore((state) => state.resetDuration);
  const isPaused = useDurationStore((state) => state.isPaused);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <Card className="group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Timer</CardTitle>
          <ThemeMenu className="animate-transition lg:opacity-0 lg:group-hover:opacity-100" />
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
          <Button onClick={toggleTimer} size="icon" variant="icon">
            {isPaused ? (
              <>
                <PauseIcon className="h-5 w-5" />
                <span className="sr-only">Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5" />
                <span className="sr-only">Start</span>
              </>
            )}
          </Button>
          <Button
            onClick={resetTimer}
            size="icon"
            variant="icon"
            disabled={duration > 0 && !isPaused}
          >
            <RefreshCcwIcon className="h-5 w-5" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="mt-8 flex items-center justify-between gap-2">
        <DurationSelector />
      </CardFooter>
    </Card>
  );
};

const ALLOWED_DURATIONS = [1, 15, 25, 30, 45, 60, 90, 120];

const DurationSelector = ({ className }: { className?: string }) => {
  const duration = useDurationStore((state) => state.duration);
  const pickedDuration = useDurationStore((state) => state.pickedDuration);
  const setDuration = useDurationStore((state) => state.setDuration);
  const isPaused = useDurationStore((state) => state.isPaused);

  const [open, setOpen] = useState(false);

  return (
    <div className={cn('flex w-full flex-col', className)}>
      <span
        className={cn(
          'mb-2 text-sm opacity-0 animate-transition group-hover:opacity-100',
          open && 'opacity-100'
        )}
      >
        Work duration
      </span>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'disabled: justify-between gap-2 capitalize animate-transition group-hover:opacity-100 disabled:opacity-50 disabled:group-hover:opacity-50 lg:opacity-0',
              open && 'lg:opacity-100'
            )}
            disabled={duration > 0 && !isPaused}
          >
            {pickedDuration > 0 ? `${pickedDuration} minutes` : 'Select a work duration'}
            <ChevronDown className="size-4" />
            <span className="sr-only">Select a work duration</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 sm:w-96">
          {ALLOWED_DURATIONS.map((allowedDuration) => (
            <DropdownMenuItem
              key={allowedDuration}
              onSelect={() => {
                setDuration(allowedDuration);
              }}
              className="cursor-pointer"
            >
              {allowedDuration} minutes
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const THEMES = ['light', 'dark', 'rose', 'orange', 'blue', 'yellow', 'violet'];

const ThemeMenu = ({ className }: { className?: string }) => {
  const { theme, resolvedTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="icon"
          className={cn('gap-2 capitalize data-[state=open]:opacity-100', className)}
        >
          <div
            className={cn(
              'size-4 rounded',
              theme === 'system' && resolvedTheme === 'light' && 'bg-zinc-300',
              theme === 'system' && resolvedTheme === 'dark' && 'bg-zinc-700',
              theme === 'light' && 'bg-zinc-300',
              theme === 'dark' && 'bg-zinc-700',
              theme === 'rose' && 'bg-rose-500',
              theme === 'orange' && 'bg-orange-500',
              theme === 'blue' && 'bg-blue-500',
              theme === 'yellow' && 'bg-yellow-500',
              theme === 'violet' && 'bg-violet-500'
            )}
          />
          {theme === 'system' ? resolvedTheme : theme}
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
