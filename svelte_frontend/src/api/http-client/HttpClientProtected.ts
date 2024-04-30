import LocalStorage from '~/storage/local-storage/LocalStorage';
import type { Options } from './types';

class HttpClientProtected {
	domain: string;
	constructor(domain: string) {
		this.domain = domain;
	}

	private query = async (url: string, options?: Options) => {
		return await fetch(`${this.domain}${url}`, {
			method: options?.method || 'GET',
			headers: {
				Authorization: `Bearer ${LocalStorage.get('accessToken')}`,
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': true,
				...options?.headers,
			},
			...options,
		});
	};

	get = async <T>(path: string) => {
		const response = await this.query(path);
		const data = await response.json();
		return data as T;
	};

	post = async <T>(path: string, body?: any, config?: Options) => {
		const options: Options = {
			method: 'POST',
			...config,
		};
		if (body) options.body = JSON.stringify(body);
		const response = await this.query(path, options);
		const data = await response.json();
		return data as T;
	};

	formData = {
		post: async <T>(path: string, body?: any, config?: Options) => {
			const options: Options = {
				method: 'POST',
				...config,
			};
			if (body) options.body = body;
			const response = await this.query(path, options);
			const data = await response.json();
			return data as T;
		},
		put: async <T>(path: string, body?: any, config?: Options) => {
			const options: Options = {
				method: 'PUT',
				...config,
			};
			if (body) options.body = body;
			const response = await this.query(path, options);
			const data = await response.json();
			return data as T;
		},
	};

	patch = async <T>(path: string, body?: any, config?: Options) => {
		const options: Options = {
			method: 'PATCH',
			...config,
		};
		if (body) options.body = JSON.stringify(body);
		const response = await this.query(path, options);
		const data = await response.json();
		return data as T;
	};

	delete = async <T>(path: string, body?: any, config?: Options) => {
		const options: Options = {
			method: 'DELETE',
			...config,
		};
		if (body) options.body = JSON.stringify(body);
		const response = await this.query(path, options);
		const data = await response.json();
		return data as T;
	};
}

export default HttpClientProtected;
