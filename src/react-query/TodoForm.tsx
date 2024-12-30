import { useRef } from 'react';
import { v4 as uuidv4 } from "uuid";
import useAddTodo from "./hooks/useAddTodo";



const TodoForm = () => {
	const ref = useRef<HTMLInputElement>(null);

	const addTodo = useAddTodo(()=>{if (ref.current) ref.current.value = '';});

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
