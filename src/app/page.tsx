import { TaskBoard } from "@/components/TaskBoard";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col px-5 py-8 sm:px-10 md:min-h-screen md:px-20 md:py-12">
      <TaskBoard />
    </main>
  );
}
