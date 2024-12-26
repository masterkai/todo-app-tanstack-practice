import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

const usePosts = (userID: number | undefined) => {
	const fetchData = async () => {
		const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params: { userId: userID } });
		return response.data;
	};
	return useQuery<Post[], Error>({
		queryKey: userID ? [ 'users', userID, 'posts' ] : [ 'posts' ],
		queryFn: fetchData,
		staleTime: 60 * 1000
	});
}

export default usePosts;