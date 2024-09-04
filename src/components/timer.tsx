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
import { PauseIcon, PlayIcon, RefreshCcwIcon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

const Timer = () => {
  const { duration, isLoading } = useDurationTracker();
  const toggleTimer = useDurationStore((state) => state.togglePause);
  const resetTimer = useDurationStore((state) => state.resetDuration);
  const isTimerPaused = useDurationStore((state) => state.isPaused);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pomodoro Timer</CardTitle>
          <ThemeMenu />
        </div>
      </CardHeader>
      <CardContent className="mt-8 flex flex-col items-center justify-center">
        {isLoading ? null : (
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
        <DurationSelector />
        <BreakSelector />
      </CardFooter>
    </Card>
  );
};

const ALLOWED_DURATIONS = [15, 25, 30, 45, 60, 90, 120];

const DurationSelector = () => {
  const setDuration = useDurationStore((state) => state.setDuration);

  return (
    <div className="flex w-full flex-col">
      <span className="mb-2 text-sm">Work duration</span>
      <Select onValueChange={(value) => setDuration(parseInt(value.split(' ')[0]))}>
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

const ALLOWED_BREAKS = [5, 10, 15];

const BreakSelector = () => {
  return (
    <div className="flex w-full flex-col">
      <span className="mb-2 text-sm">Break duration</span>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a break duration" />
        </SelectTrigger>
        <SelectContent>
          {ALLOWED_BREAKS.map((allowedBreak) => (
            <SelectItem value={allowedBreak + ' minutes'}>{allowedBreak} minutes</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

const THEMES = [
  'light',
  'dark',
  'slate',
  'stone',
  'rose',
  'orange',
  'green',
  'blue',
  'yellow',
  'violet',
];

const ThemeMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Sun className="h-5 w-5" />
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
          theme === 'light' && 'bg-zinc-200',
          theme === 'dark' && 'bg-zinc-900',
          theme === 'slate' && 'bg-slate-900',
          theme === 'stone' && 'bg-stone-900',
          theme === 'rose' && 'bg-rose-500',
          theme === 'orange' && 'bg-orange-500',
          theme === 'green' && 'bg-green-500',
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
