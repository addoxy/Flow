'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudioPlayer } from '@/lib/hooks/use-audio-player';
import { cn } from '@/lib/utils';
import { Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

type SongProps = {
  name: string;
  descriptor: string;
};

const SONGS: SongProps[] = [
  { name: 'Cafe', descriptor: 'Bustle' },
  { name: 'Library', descriptor: 'Calm' },
  { name: 'Fan', descriptor: 'Whirr' },
  { name: 'Ocean', descriptor: 'Waves' },
  { name: 'Rain', descriptor: 'Drizzle' },
  { name: 'Forest', descriptor: 'Nature' },
  { name: 'Keyboard', descriptor: 'Clicks' },
  { name: 'Waterfall', descriptor: 'Cascade' },
  { name: 'Wind', descriptor: 'Breeze' },
];

const SongPlayer = () => {
  const { currentSong, isPlaying, play, pause, toggle, loadAudio } = useAudioPlayer();
  const [loopCount, setLoopCount] = useState(0);

  useEffect(() => {
    SONGS.forEach((song) => loadAudio(song.name, `/audio/${song.name.toLowerCase()}.mp3`));
  }, []);

  useEffect(() => {
    if (currentSong && isPlaying) {
      const interval = setInterval(() => {
        setLoopCount((prevCount) => prevCount + 1);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    setLoopCount(0);
  }, [currentSong]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Song Player</CardTitle>
      </CardHeader>
      <CardContent className="mt-8">
        <ScrollArea className="flex h-full flex-col">
          {SONGS.map((song) => (
            <Song key={song.name} {...song} className="p-2 first-of-type:pt-0" />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const Song = (
  props: SongProps & {
    className?: string;
  }
) => {
  const { name, descriptor, className } = props;
  const { currentSong, isPlaying, play, toggle } = useAudioPlayer();

  function handleSong() {
    if (currentSong && currentSong === name) {
      toggle(currentSong);
    } else {
      play(name);
    }
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center gap-4">
        <Image
          src={`/images/${name.toLowerCase()}.jpg`}
          className="rounded-md"
          alt={name}
          width={64}
          height={64}
        />
        <div className="flex flex-col justify-between">
          <span>{name}</span>
          <span className="text-muted-foreground">{descriptor}</span>
        </div>
      </div>
      <Button onClick={handleSong} size="icon" variant="ghost">
        {currentSong && currentSong === name && isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default SongPlayer;
