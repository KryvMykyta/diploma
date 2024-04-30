<script lang="ts">
	import { onMount } from 'svelte';
	import MainProtected from '~/api/main/protected/MainProtected';
	import Card from '~/lib/Card.svelte';
	import Header from '~/lib/Header.svelte';
	import type { MoviesList, Movie, MovieRecommendation } from '~/types';

	let currentPage: number = 1;
	let movies: MovieRecommendation[];
	let isLoading: boolean = false;

	const fetchData = async(page: number) =>{
		isLoading = true;
		const res = await MainProtected.getRecommendations();
		movies = res;
		currentPage = page;
		isLoading = false;
	}

	onMount(() => {
		fetchData(1);
	});

</script>

<div class="content-wrapper">
	<Header {fetchData}/>
	{#if movies?.length > 0}
		<div class="cards">
			{#each movies as movie}
				<Card {movie} movieId={`${movie.id}`} {fetchData}/>
			{/each}
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
