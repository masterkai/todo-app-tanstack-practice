import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService, { Todo } from "../services/todosService";
import { CACHE_KEY_TODOS } from "../const";

const useUpdateTodo = () => {
	const queryClient = useQueryClient();
	return useMutation<Todo, Error, Todo>({
	  mutationFn: (data) => todosService.put(data.id, data),
	  onSuccess: () => {
		  // Invalidate queries to refresh data after deletion
		  queryClient.invalidateQueries({ queryKey: CACHE_KEY_TODOS }).then(() => {
			  console.log('updated successfully')
		  });
	  },
	  onError: (error) => {
		  console.error("updated failed:", error);
	  },
  })
}

export default useUpdateTodo;