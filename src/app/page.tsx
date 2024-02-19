import Todos from "@/components/todos";
import { getTodos } from "@/lib/data";

export default async function Home() {
  const { todos = [] } = await getTodos();
  return (
    <main className="flex min-h-screen flex-col items-center justify-ccenter p-24">
      <div className="max-w-2xl mx-auto w-full ">
        <h1 className="mb-1 font-serif text-4xl font-bold text-center">
          Nextjs Todo App
        </h1>

        <br />
        <div>
          <Todos todos={todos} />
        </div>
      </div>
    </main>
  );
}
