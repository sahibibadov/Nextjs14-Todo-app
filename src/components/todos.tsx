"use client";
import type { Todo } from "@prisma/client";
import React, { useOptimistic, useRef } from "react";
import TodoItem from "./todo-item";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "@/lib/actions";
import { toast } from "sonner";
import { z } from "zod";

// validate schema
const schema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
});

const Todos = ({ todos }: { todos: Todo[] }) => {
  // form reset ref
  const formRef = useRef<HTMLFormElement>(null);
  // optimisctiv todos
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => {
      return [...state, newTodo];
    }
  );

  // create form action
  const formAction = async (prevState: any, formData: FormData) => {
    const title = formData.get("title") as string;

    // validate form
    const parseResult = schema.safeParse({ title });

    if (!parseResult.success) {
      return { errors: parseResult.error.flatten().fieldErrors };
    }

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    formRef?.current?.reset();

    // add optimistic todos
    addOptimisticTodo(newTodo);

    // form reset
    // creeate todo action
    const result = await createTodo(title as string);

    if (result?.error) {
      toast.error(result.error);
    }
    toast.success("Todo created");
  };
  const [state, action] = useFormState(formAction, null);
  return (
    <div>
      <form ref={formRef} action={action} className="flex gap-2 flex-col">
        <Input type="text" placeholder="title" name="title" />
        <p className="text-red-500">{state?.errors && state?.errors.title}</p>
        <SubmitButton />
      </form>
      <br />
      <ul className="list-disc">
        {optimisticTodos.map((todo) => {
          return <TodoItem key={todo.id} todo={todo} />;
        })}
      </ul>
    </div>
  );
};

export default Todos;
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}
