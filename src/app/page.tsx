import Notes from '@/components/notes';
import SongPlayer from '@/components/song-player';
import TaskManager from '@/components/task-manager';
import Timer from '@/components/timer';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2">
      <Timer />
      <TaskManager />
      <SongPlayer />
      <Notes />
    </div>
  );
}
