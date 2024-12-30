import APIClient from "./api-client";
import { Todo } from "../hooks/useToddos";

const todosService =  new APIClient<Todo>('TodoItems');

export default todosService;