import prisma from "@/lib/primsa";


export const  getTodos = async ()=> {
    try {
        const todos = await prisma.todo.findMany();
        return {todos}
    } catch (error) {
        return {error}
    }
} 

export const getTodoById = async (id:string)=>{
    try {
        const todo = await prisma.todo.findUnique({where: {id}});
        return {todo}
    } catch (error) {
        return {error}
    }
}