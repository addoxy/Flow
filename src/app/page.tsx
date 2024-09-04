import Timer from '@/components/timer';

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <Timer />
    </div>
  );
}
