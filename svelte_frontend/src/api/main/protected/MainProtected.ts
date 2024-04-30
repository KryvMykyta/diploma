import type {
	LoginData,
	LoginRes,
	MovieRecommendation,
	MoviesList,
	RatingData,
	SignupData,
	SignupRes,
	User,
	UserRatingRes,
} from '~/types';
import HttpClientProtected from '../../http-client/HttpClientProtected';

class MainProtected extends HttpClientProtected {
	constructor() {
		super(import.meta.env.VITE_BASE_API_URL);
	}

	public signup = async (data: SignupData) => {
		return await this.post<SignupRes>('/auth/signup', data);
	};

	public login = async (data: LoginData) => {
		return await this.post<LoginRes>('/auth/login', data);
	};

	public user = async () => {
		return await this.get<User>('/user');
	};

	public getMovies = async (page: number, limit: number, search: string) => {
		return await this.get<MoviesList>(
			`/movie?page=${page}&limit=${limit}&search=${search}`
		);
	};

	public addRating = async (data: RatingData) => {
		return await this.post('/movie/rating', data);
	};

	public getRecommendations = async () => {
		return await this.get<MovieRecommendation[]>('/movie/recommendations');
	};

	public getRatings = async (page: number, limit: number) => {
		return await this.get<UserRatingRes>(`/user/ratings?page=${page}&limit=${limit}`)
	}
}

export default new MainProtected();
