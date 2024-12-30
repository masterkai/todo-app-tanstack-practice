import APIClient from "./api-client";
export interface Todo {
	id: string;
	title: string;
	isComplete: boolean;
}
const todosService =  new APIClient<Todo>('TodoItems');

export default todosService;