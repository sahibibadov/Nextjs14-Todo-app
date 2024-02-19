"use client";
import type { Todo } from "@prisma/client";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { formatDate } from "@/lib/utils";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { deleteTodo, updateTodo } from "@/lib/actions";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodo, updateTodoOptimisctic] = useOptimistic(
    todo,
    (
      todo,
      { isCompleted, updatedAt }: { isCompleted: boolean; updatedAt: Date }
    ) => {
      return { ...todo, isCompleted, updatedAt };
    }
  );

  // update todo
  const handleChange = async (isCompleted: boolean) => {
    const updatedAt = new Date();
    // update optimistic todo
    updateTodoOptimisctic({ isCompleted, updatedAt });

    const result = await updateTodo(optimisticTodo.id, isCompleted);

    if (result?.error) {
      toast.error(result.error);
    }
  };

  return (
    <li className="flex items-center gap-3 mb-2">
      <Checkbox
        id={optimisticTodo.id}
        className="peer"
        defaultChecked={optimisticTodo.isCompleted}
        checked={optimisticTodo.isCompleted}
        onCheckedChange={(checked: boolean) => {
          startTransition(() => handleChange(checked));
        }}
      />
      <Label
        htmlFor={optimisticTodo.id}
        className="cursor-pointer peer-data-[state=checked]:text-gray-500 peer-data-[state=checked]:line-through"
      >
        {optimisticTodo.title}
      </Label>
      <span className="ml-auto text-sm text-gray-500 peer-data-[state=checked]:text-gray-500 peer-data-[state=checked]:line-through">
        {formatDate(optimisticTodo.updatedAt)}
      </span>
      <form action={deleteTodo}>
        <input type="hidden" name="id" value={optimisticTodo.id} />
        <Button
          size="icon"
          className="rounded-full bg-transparent hover:bg-transparent"
        >
          <TrashIcon color="red" size={18} />
        </Button>
      </form>
    </li>
  );
};

export default TodoItem;
