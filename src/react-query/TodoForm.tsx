import { useRef } from 'react';
import { useMutation } from "@tanstack/react-query";
import { Todo } from "./hooks/useToddos";
import axios from "axios";
import { useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from "uuid";
const TodoForm = () => {
	let queryClient = useQueryClient();
	const ref = useRef<HTMLInputElement>(null);
	const addTodo = useMutation<Todo, Error, Todo>({
		mutationFn: (todo: Todo) => axios.post<Todo>('https://localhost:7296/api/TodoItems', todo).then((response) => response.data),
		onSuccess: (savedDATA, newTodo) => {
			console.log("savedDATA", savedDATA);
			// Query invalidation
			queryClient.invalidateQueries({
				queryKey: [ 'todos' ]
			}).then(() => {
				console.log('success');
			});

		},
		onError: (error, newTodo) => {
			console.log("error", error);
		},
	})

	return (
		<>
			{ addTodo.error  && <div className="alert alert-danger">{addTodo.error.message}</div>}
			<form onSubmit={(event) => {
				event.preventDefault();
				if (ref.current && ref.current.value) {
					addTodo.mutate({ id: uuidv4(), title: ref.current.value, completed: false })
					ref.current.value = '';
				}
			}} className="row mb-3">
				<div className="col">
					<input ref={ref} type="text" className="form-control"/>
				</div>
				<div className="col">
					<button className="btn btn-primary">Add</button>
				</div>
			</form>
		</>
	);
};

export default TodoForm;
