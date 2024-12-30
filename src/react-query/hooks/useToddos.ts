import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../const";
import todosService from "../services/todosService";

export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

const useTodos = () => {

	return useQuery<Todo[], Error>({
		queryKey: CACHE_KEY_TODOS,
		queryFn: todosService.get,
		staleTime: 10 * 1000
	});
}

export default useTodos;