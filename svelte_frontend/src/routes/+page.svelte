<script lang="ts">
	import { onMount } from 'svelte';
	import MainProtected from '~/api/main/protected/MainProtected';
	import Card from '~/lib/Card.svelte';
	import Header from '~/lib/Header.svelte';
	import type { MoviesList, Movie } from '~/types';

	let currentPage: number = 1;
	let movies: MoviesList;
	let totalPages: number = 0;
	let limit: number = 40;
	let search = '';
	let isLoading: boolean = false;
	let timer: NodeJS.Timeout;

	$: totalPages = movies?.totalPages;

	const fetchData = async(page: number) =>{
		isLoading = true;
		const res = await MainProtected.getMovies(page, limit, search);
		movies = res;
		currentPage = page;
		isLoading = false;
	}

	onMount(() => {
		fetchData(1);
	});

	const debounce = (value: string) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			search = value;
			fetchData(1);
		}, 750);
	};

	function nextPage() {
		const nextPage = currentPage + 1;
		if (nextPage <= totalPages) {
			currentPage = nextPage;
			fetchData(nextPage);
		}
	}

	function prevPage() {
		const prevPage = currentPage - 1;
		if (prevPage >= 1) {
			currentPage = prevPage;
			fetchData(prevPage);
		}
	}
</script>

<div class="content-wrapper">
	<Header {fetchData}/>
	<input
		type="string"
		placeholder="Search by film name..."
		bind:value={search}
		on:keyup={({ target: { value } }) => debounce(value)}
	/>
	{#if movies?.movies.length > 0}
		<div class="cards">
			{#each movies?.movies as movie}
				<Card {movie} movieId={`${movie.id}`} {fetchData}/>
			{/each}
		</div>
		<div class="pagination">
			<button on:click={prevPage} disabled={currentPage === 1 || isLoading}
				>Previous</button
			>

			<span>Page {currentPage} of {totalPages}</span>
			<button
				on:click={nextPage}
				disabled={currentPage === totalPages || isLoading}>Next</button
			>
		</div>
	{:else}
		<p>No movies {':('}</p>
	{/if}
</div>

<style>
	.content-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}
	.cards {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 10px;
		margin: 10px;
		font-family: 'Inter', sans-serif;
		justify-content: center;
		width: 100%;
	}
	.pagination {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin: 20px 0;
	}
	input {
		outline: none;
		border: none;
		width: 100%;
		max-width: 238px;
		background-color: #ebebeb;
		border-radius: 4px;
		font-size: 16px;
		height: 38px;
		color: #000000;
		padding: 0 8px;
		font-weight: 300;
		min-width: 50%;
		&:disabled {
			opacity: 0.5;
		}
	}
</style>
