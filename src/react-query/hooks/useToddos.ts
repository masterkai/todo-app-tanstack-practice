import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

const useTodos = () => {
	const fetchTodos = async () => {
		const response = await axios.get<Todo[]>('https://localhost:7296/api/TodoItems');
		return response.data;
	};
	return useQuery<Todo[], Error>({
		queryKey: [ 'todos' ],
		queryFn: fetchTodos,
		staleTime: 10 * 1000
	});
}

export default useTodos;