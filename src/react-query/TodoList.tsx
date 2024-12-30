import React, { useEffect, useState } from 'react';
import useTodos from "./hooks/useTodos";
import { MdDeleteForever } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService, { Todo } from "./services/todosService";
import { CACHE_KEY_TODOS } from "./const";
import { FiEdit2 } from "react-icons/fi";


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
	const [ isEditing, setIsEditing ] = React.useState(false);
	const queryClient = useQueryClient();
	const mutation = useMutation<Todo, Error, Todo>({
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
	const handleEdit = () => {
		setIsEditing(prevState => !prevState);
	};
	const handleDelete = () => {
		mutation.mutate(todo);
	};
	return (
		<li key={todo.id} className="list-group-item">
			<div className="d-flex justify-content-between align-content-center">
				{
					isEditing ? <EditableInput data={todo}/> : <span>{todo.title}</span>
				}
				<div style={{ width: '60px', display: 'flex', justifyContent: 'space-between', paddingLeft: '12px' }}>
					<span style={{ cursor: 'pointer' }} onClick={() => handleEdit()}><FiEdit2/></span>
					<span style={{ cursor: 'pointer' }} onClick={() => handleDelete()}><MdDeleteForever/></span>
				</div>
			</div>
		</li>
	);

}

function EditableInput({ data }: { data: Todo }) {
	const [ value, setValue ] = useState(data.title);
	const [timer, setTimer] = useState(0);
	const queryClient = useQueryClient();
	const mutation = useMutation<Todo, Error, Todo>({
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
	});
	const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Update the input value
		setValue(e.target.value);
		// Debounce the input to avoid multiple requests
		clearTimeout(timer);
		setTimer(setTimeout(() => {
			mutation.mutate({ ...data, title: e.target.value });
		}, 1000));
	};
	useEffect(() => {
		return () => {
			clearTimeout(timer);
		};
	}, [timer]);

	return (
		<input className='form-control' type="text" value={value} onChange={handleUpdate}/>
	);
}
