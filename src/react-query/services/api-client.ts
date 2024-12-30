import axios from "axios";

const axiosInstance = axios.create({
	baseURL: 'https://localhost:7296/api',
	headers: {
		'Content-Type': 'application/json'
	}
})

class APIClient<T> {
	endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = endpoint;
	}

	get = async () => {
		const response = await axiosInstance.get<T[]>(this.endpoint);
		return response.data;
	}
	post = async (data: T) => {
		const response = await axiosInstance.post<T>(this.endpoint, data);
		return response.data;
	}
	put = async (id: string, data: T) => {
		const response = await axiosInstance.put<T>(`${this.endpoint}/${id}`, data);
		return response.data;
	}
	delete = async (id: string) => {
		const response = await axiosInstance.delete(`${this.endpoint}/${id}`);
		return response.data;
	}
}

export default APIClient;