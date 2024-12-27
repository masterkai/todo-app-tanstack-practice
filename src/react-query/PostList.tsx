import axios from 'axios';
import React, { useEffect, useState } from 'react';
import usePosts from "./hooks/usePosts";


const PostList = () => {
	const pageSize = 10;

	const { data: posts, error, isLoading, fetchNextPage, isFetchingNextPage } = usePosts({ pageSize });

	if (isLoading) return <p>Loading...</p>;

	if (error) return <p>{error.message}</p>;

	return (
		<>
			<ul className="list-group">
				{posts.pages.map((page,idx) => (
					<React.Fragment key={idx}>
						{page.map((post) => (
							<li key={post.id} className="list-group-item">
								{post.title}
							</li>
						))}
					</React.Fragment>
				))}
			</ul>
			<div className='my-5'>
				<button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} className='btn btn-primary'>{isFetchingNextPage ? 'Loading...' : 'Load More'}</button>
			</div>
		</>
	);
};

export default PostList;
