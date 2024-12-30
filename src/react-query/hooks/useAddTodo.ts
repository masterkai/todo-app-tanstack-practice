import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_TODOS } from "../const";
import todosService, { Todo } from "../services/todosService";
interface AddTodoContext {
	previousTodos: Todo[];
}

const useAddTodo = (onAdd:()=>void) => {
	let queryClient = useQueryClient();
	return useMutation<Todo, Error, Todo, AddTodoContext>({
		mutationFn: (todo: Todo) => todosService.post(todo),
		onMutate: (newTodo) => {
			const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];
			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (old) => {
				return old ? [ ...old, newTodo ] : [ newTodo ];
			});
			onAdd();
			return { previousTodos };
		},
		onSuccess: (savedDATA, newTodo) => {
			console.log("savedDATA", savedDATA);
			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, (old) => {
				return old ? old.map(todo => todo.id === newTodo.id ? savedDATA : todo) : [ savedDATA ];
			});
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: CACHE_KEY_TODOS
			}).then(() => {
				console.log('success');
			});

		},
		onError: (error, newTodo, context) => {
			console.log("error", error);
			if (!context) return;
			queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context?.previousTodos);
		},
	})
}

export default useAddTodo;