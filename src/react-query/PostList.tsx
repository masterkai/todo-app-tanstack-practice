import axios from 'axios';
import React, { useEffect, useState } from 'react';
import usePosts from "./hooks/usePosts";


const PostList = () => {
	const [userID, setUserID] = useState<number>();
	const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setUserID(parseInt(e.target.value));
	};
	const { data: posts, error, isLoading } = usePosts(userID);

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<>
			<select value={userID} onChange={handleSelect} className='form-select mb-5'>
				<option value=''>All</option>
				<option value='1'>user 1</option>
				<option value='2'>user 2</option>
				<option value='3'>user 3</option>
			</select>
			<ul className="list-group">
				{posts?.map((post) => (
					<li key={post.id} className="list-group-item">
						{post.title}
					</li>
				))}
			</ul>
		</>
	);
};

export default PostList;
