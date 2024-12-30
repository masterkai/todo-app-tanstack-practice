import React, { useEffect, useState } from 'react';
import useTodos from "./hooks/useTodos";
import { MdDeleteForever } from "react-icons/md";
import { Todo } from "./services/todosService";
import { FiEdit2 } from "react-icons/fi";
import useUpdateTodo from "./hooks/useUpdateTodo";
import useDeleteTodo from "./hooks/useDeleteTodo";


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
	const deleteTodo = useDeleteTodo();
	const updateTodo = useUpdateTodo();
	const handleEdit = () => {
		setIsEditing(prevState => !prevState);
	};
	const handleDelete = () => {
		deleteTodo.mutate(todo);
	};
	const handleUpdate = () => {
		updateTodo.mutate({ ...todo, isComplete: !todo.isComplete });
	};
	return (
		<li key={todo.id} className="list-group-item">
			<div className="d-flex justify-content-between align-content-center">
				{
					isEditing ? <EditableInput data={todo}/> : <span onClick={handleUpdate} style={{ cursor: 'pointer', textDecoration: todo.isComplete ? 'line-through' : 'none' }}>{todo.title}</span>
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
	const updateTodo = useUpdateTodo();
	const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Update the input value
		setValue(e.target.value);
		// Debounce the input to avoid multiple requests
		clearTimeout(timer);
		setTimer(setTimeout(() => {
			updateTodo.mutate({ ...data, title: e.target.value });
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
