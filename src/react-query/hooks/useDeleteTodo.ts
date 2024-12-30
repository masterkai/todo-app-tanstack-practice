import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService, { Todo } from "../services/todosService";
import { CACHE_KEY_TODOS } from "../const";

const useDeleteTodo = () => {
	const queryClient = useQueryClient();
	return useMutation<Todo, Error, Todo>({
	  mutationFn: (todo) => todosService.delete(todo.id),
	  onSuccess: () => {
		  // Invalidate queries to refresh data after deletion
		  queryClient.invalidateQueries({ queryKey: CACHE_KEY_TODOS }).then(() => {
			  console.log('deleted successfully')
		  });
	  },
	  onError: (error) => {
		  console.error("Deletion failed:", error);
	  },
  });
}

export default useDeleteTodo;