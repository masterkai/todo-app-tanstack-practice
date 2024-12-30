import React from 'react';
import useTodos, { Todo } from "./hooks/useToddos";
import { MdDeleteForever } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


const TodoList = () => {

	const { data: todos, error, isLoading } = useTodos();

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<ul className="list-group">
			{todos?.map((todo) => (
				<Item todo={todo} key={todo.id}/>
			))}
		</ul>
	);
};

export default TodoList;

interface Item {
	todo: Todo;
}

function Item({ todo }: Item) {
	const queryClient = useQueryClient();
	const mutation = useMutation<Todo, Error, Todo>({
		mutationFn: async (todo) => axios.delete<Todo>(`https://localhost:7296/api/TodoItems/${todo.id}`).then((response) => response.data),
		onSuccess: () => {
			// Invalidate queries to refresh data after deletion
			queryClient.invalidateQueries({ queryKey: [ "todos" ] }).then(() => {
				console.log('deleted successfully')
			});
		},
		onError: (error) => {
			console.error("Deletion failed:", error);
		},
	});

	const handleDelete = () => {
		mutation.mutate(todo);
	};
	return (
		<li key={todo.id} className="list-group-item">
			<div className="d-flex justify-content-between align-content-center">
				<span>{todo.title}</span>
				<span onClick={() => handleDelete()}><MdDeleteForever/></span>
			</div>
		</li>
	);

}
