import axios from "axios";
import { useQuery, keepPreviousData  } from "@tanstack/react-query";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}
interface PostQuery {
	page: number;
	pageSize: number;
}

const usePosts = (query: PostQuery) => {
	const fetchData = async () => {
		const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params: { _start: (query.page - 1) * query.pageSize, _limit: query.pageSize } });
		return response.data;
	};
	return useQuery<Post[], Error>({
		queryKey: [ 'posts', query ],
		queryFn: fetchData,
		staleTime: 60 * 1000,
		placeholderData: keepPreviousData,
	});
}

export default usePosts;