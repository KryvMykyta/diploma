<script lang="ts">
	import type { Movie } from '~/types';
	import PopcornIcon from './img/PopcornIcon.svelte';
	import StarIcon from './img/StarIcon.svelte';
	import CrossIcon from './img/CrossIcon.svelte';
	import SuccessIcon from './img/SuccessIcon.svelte';
	import MainProtected from '~/api/main/protected/MainProtected';
	import LoginModal from './LoginModal.svelte';
	import {
		BootstrapToast,
		FlatToast,
		ToastContainer,
		toasts,
	} from 'svelte-toasts';

	export let movie: Movie;
	export let movieId: string;
	export let fetchData: (page: number) => Promise<void>

	let addRate: boolean = false;
	let rate: string = '';
	let showModal: boolean = false;
	let dialog: HTMLDialogElement;

	const showToast = (message: string) => {
		const toast = toasts.add({
			description: message,
			duration: 2700,
			placement: 'bottom-right',
			type: 'success',
			theme: 'light',
			showProgress: true,
			onClick: () => {},
			onRemove: () => {},
			component: BootstrapToast,
		});
	};
	const showError = (message: string) => {
		const toast = toasts.add({
			description: message,
			duration: 2700,
			placement: 'bottom-right',
			type: 'error',
			theme: 'light',
			showProgress: true,
			onClick: () => {},
			onRemove: () => {},
			component: BootstrapToast,
		});
	};

	const rateFilm = async () => {
		const authorized = localStorage.getItem('accessToken');
		if (!authorized) return (showModal = true);
		addRate = !addRate;
		if (rate !== '') {
			await postRating(movieId, Number(rate));
			addRate = false;
		}
	};

	const cancelRate = () => {
		addRate = false;
		rate = '';
	};

	async function postRating(movieId: string, rating: number) {
		const data = {
			movieId: movieId,
			rating: rating,
		};
		const res = await MainProtected.addRating(data);
		if (res.rating) {
			showToast('Movie rated!');
			fetchData(1)
		} else {
			showError(res.message);
		}
	}
</script>

<div class="card-wrapper">
	<div class="movie-placeholder">
		<PopcornIcon />
	</div>
	<div class="movie-info">
		<p class="movie-title" title={movie.title}>{movie.title}</p>
		<p class="movie-sub-title" title={movie.genres}>
			{movie.genres.replace(/\|/g, ' | ')}
		</p>
		<span class="movie-stars">
			<StarIcon />
			<p class="movie-sub-title">{movie.avgRating || 0}</p>
		</span>
		<a class="link" href={`https://www.imdb.com/title/tt${movie.link.imdbId}`}>
			Check on IMDB →
		</a>
		<a
			class="link"
			href={`https://www.themoviedb.org/movie/${movie.link.tmdbId}`}
		>
			Check on TMDB →
		</a>
		{#if movie?.ratings?.length > 0}
			<p>
				You rated this film on: {movie?.ratings?.map((rate) => rate.rating)}
			</p>
		{:else if addRate}
			<div class="input-field">
				<input type="number" max="5" min="0" bind:value={rate} />
				<button on:click={rateFilm} class="success">
					<SuccessIcon />
				</button>
				<button on:click={cancelRate}>
					<CrossIcon />
				</button>
			</div>
		{:else}
			<button class="rate" on:click={rateFilm}>Rate film</button>
		{/if}
	</div>
</div>

<ToastContainer let:data>
	<FlatToast {data} />
</ToastContainer>

<LoginModal bind:showModal bind:dialog {fetchData} />

<style>
	.input-field {
		display: flex;
		gap: 5px;
		align-items: center;
		& svg {
			cursor: pointer;
			width: 18px;
			height: 18px;
		}
		& button {
			border: none;
			background-color: #fff;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.success {
		& svg {
			cursor: pointer;
			width: 14px;
			height: 14px;
		}
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
	.card-wrapper {
		display: flex;
		padding: 6px;
		background-color: #ffff;
		border: 1px solid rgb(211, 211, 211);
		border-radius: 4px;
		max-width: 283px;
		overflow: hidden;
		width: 100%;
		text-overflow: ellipsis;
	}
	.movie-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 0 8px;
		width: calc(100% - 85px);
		text-overflow: ellipsis;
	}
	.movie-title {
		font-size: 16px;
		font-weight: 500;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.movie-sub-title {
		font-size: 14px;
		font-weight: 400;
		margin: 0;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.movie-placeholder {
		min-width: 75px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #b7b7b75c;
		min-height: 80px;
		border-radius: 2px;
		& svg {
			width: 22px;
			color: #515151;
			height: 22px;
		}
	}
	.movie-stars {
		display: flex;
		align-items: flex-end;
		gap: 5px;
		& svg {
			width: 16px;
			height: 16px;
			color: #eadc1e;
		}
	}
	.link {
		text-decoration: none;
		color: #6a94b9;
		width: fit-content;
		font-size: 14px;
		font-weight: 400;
	}
	.rate {
		cursor: pointer;
	}
	p {
		font-size: 14px;
		font-weight: 400;
		margin: 0;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		margin-top: auto;
	}
</style>
