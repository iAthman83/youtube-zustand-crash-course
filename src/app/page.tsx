import MoodTracker from "@/components/MoodTrackerArray";

export default function Home() {
  return (
    <main className="min-h-[100svh] w-full bg-gradient-to-b from-zinc-50 to-zinc-100 text-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <MoodTracker title="Mood Tracker" />
      </div>
    </main>
  );
}
