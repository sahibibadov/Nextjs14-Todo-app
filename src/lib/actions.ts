"use server";
import prisma from "@/lib/primsa";
import { revalidatePath } from "next/cache";

export const createTodo = async (title: string) => {
  try {
    const todo = await prisma.todo.create({
      data: { title },
    });
    return { todo };
  } catch (error: any) {
    return { error: error?.message || "Failed to add todo." };
  } finally {
    revalidatePath("/");
  }
};

export const updateTodo = async (id: string, isCompleted: boolean) => {
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { isCompleted },
    });
    return { todo };
  } catch (error: any) {
    return { error: error?.message || "Failed to update todo." };
  } finally {
    revalidatePath("/");
  }
};

export const deleteTodo = async (formData: FormData) => {
  const id = formData.get("id") as string;
  try {
    await prisma.todo.delete({
      where: { id },
    });
  } catch (error) {
    return { error };
  } finally {
    revalidatePath("/");
  }
};
