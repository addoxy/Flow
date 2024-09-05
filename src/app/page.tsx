import SongPlayer from '@/components/song-player';
import TaskManager from '@/components/task-manager';
import Timer from '@/components/timer';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <Timer />
      <TaskManager />
      <SongPlayer />
    </div>
  );
}
