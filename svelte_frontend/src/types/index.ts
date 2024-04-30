export type SignupData = {
	username: string;
	email: string;
	password: string;
};
export type LoginData = {
	username: string;
	password: string;
};
export type RatingData = {
	movieId: string;
	rating: number;
};
export type MoviesList = {
	movies: {
		id: number;
		title: string;
		genres: string;
		avgRating: number;
		link: {
			moviesId: number;
			imdbId: string;
			tmdbId: string;
		};
		ratings: [
			{
				id: number;
				movieId: number;
				userId: number;
				rating: number;
			},
		];
	}[];
	page: string;
	totalPages: number;
};
export type Movie = {
	id: number;
	title: string;
	genres: string;
	avgRating: number;
	link: {
		moviesId: number;
		imdbId: string;
		tmdbId: string;
	};
	ratings: [
		{
			id: number;
			movieId: number;
			userId: number;
			rating: number;
		},
	];
};

export type MovieRecommendation = {
	id: number;
	title: string;
	genres: string;
	avgRating: number;
	link: {
		moviesId: number;
		imdbId: string;
		tmdbId: string;
	};
	ratings: [
		{
			id: number;
			movieId: number;
			userId: number;
			rating: number;
		},
	];
};

export type UserRating = {
	id: number
	movieId: number
	userId: number
	rating: number
	movie: {
		id: number
		title: string
		genres: string
		avgRating: number;
		link: {
			moviesId: number;
			imdbId: string;
			tmdbId: string;
		};
	}
}

export type UserRatingRes = {
	userRatings: UserRating[]
	page: number
	totalPages: number
}

export type SignupRes = {
	user: {
		id: number;
		username: string;
		email: string;
		password: string;
	};
};

export type LoginRes = {
	user: {
		id: number;
		username: string;
		email: string;
		password: string;
	};
	token: string;
};
export type User = {
	id: number;
	username: string;
	iat: number;
	exp: number;
};
