import { useRef } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Todo } from "./hooks/useToddos";
import axios from "axios";
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from "uuid";

interface AddTodoContext {
	previousTodos: Todo[];
}

const TodoForm = () => {
	let queryClient = useQueryClient();
	const ref = useRef<HTMLInputElement>(null);
	const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
		mutationFn: (todo: Todo) => axios.post<Todo>('https://localhost:7296/api/TodoItems', todo).then((response) => response.data),
		onMutate: (newTodo) => {
			const previousTodos = queryClient.getQueryData<Todo[]>([ 'todos' ]) || [];
			queryClient.setQueryData<Todo[]>([ 'todos' ], (old) => {
				return old ? [ ...old, newTodo ] : [ newTodo ];
			});
			if (ref.current) ref.current.value = '';
			return { previousTodos };
		},
		onSuccess: (savedDATA, newTodo) => {
			console.log("savedDATA", savedDATA);
			queryClient.setQueryData<Todo[]>([ 'todos' ], (old) => {
				return old ? old.map(todo => todo.id === newTodo.id ? savedDATA : todo) : [ savedDATA ];
			});
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: [ 'todos' ]
			}).then(() => {
				console.log('success');
			});

		},
		onError: (error, newTodo, context) => {
			console.log("error", error);
			if (!context) return;
			queryClient.setQueryData<Todo[]>([ 'todos' ], context?.previousTodos);
		},
	})

	return (
		<>
			{addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}
			<form onSubmit={(event) => {
				event.preventDefault();
				if (ref.current && ref.current.value) {
					addTodo.mutate({ id: uuidv4(), title: ref.current.value, completed: false })

				}
			}} className="row mb-3">
				<div className="col">
					<input ref={ref} type="text" className="form-control"/>
				</div>
				<div className="col">
					<button
						disabled={addTodo.isPending}
						className="btn btn-primary"
					>
						{addTodo.isPending ? 'Saving...' : 'Save'}
					</button>
				</div>
			</form>
		</>
	);
};

export default TodoForm;
