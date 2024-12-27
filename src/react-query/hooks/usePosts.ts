import axios from "axios";
import { useQuery, keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}
interface PostQuery {
	pageSize: number;
}

const usePosts = ({pageSize}: PostQuery) => {
	return useInfiniteQuery<Post[], Error>({
		initialData: undefined, initialPageParam: undefined,
		queryKey: [ 'posts', pageSize ],
		queryFn: async ({ pageParam = 1 }) => {
			// @ts-ignore
			const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts', { params: { _start: (pageParam - 1) * pageSize, _limit: pageSize } });
			return response.data;
		},
		staleTime: 60 * 1000,
		getNextPageParam: (lastPage, allPages) => lastPage.length > 0 ? allPages.length + 1 : undefined
	});
}

export default usePosts;