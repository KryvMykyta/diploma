<script lang="ts">
	import { onMount } from 'svelte';
	import LoginModal from './LoginModal.svelte';
	import { goto } from '$app/navigation';

	export let fetchData: (page: number) => Promise<void> = async (
		page: number
	) => {};

	let token: string | null;
	let showModal: boolean = false;
	let dialog: HTMLDialogElement;
	let loggedIn: boolean;

	onMount(() => (token = localStorage.getItem('accessToken')));

	const logout = () => {
		localStorage.removeItem('accessToken');
		token = null;
		loggedIn = false;
		fetchData(1);
	};

	$: loggedIn = token !== null;
</script>

<header>
	<button on:click={() => goto('/')}>Home</button>
	<!-- <button on:click={() => goto('/me')} disabled={!loggedIn}>Me</button> -->
	<button on:click={() => goto('/recommendations')} disabled={!loggedIn}>Movie Recommendations</button>
	<button on:click={() => goto('/ratings')} disabled={!loggedIn}>My ratings</button>

	{#if loggedIn}
		<button class="last-item" on:click={logout}>Log Out →</button>
	{:else}
		<button class="last-item" on:click={() => (showModal = true)}
			>Login →</button
		>
	{/if}
</header>

<LoginModal bind:showModal bind:dialog bind:loggedIn {fetchData} />

<style>
	header {
		display: flex;
		padding: 12px;
		width: 100%;
		border-bottom: 1px solid black;
		justify-content: center;
		align-items: center;
		gap: 8px;
	}
	button {
		position: relative;
		cursor: pointer;
		height: 38px;
		font-size: 17px;
		width: 70%;
		text-transform: uppercase;
		width: fit-content;
		padding: 0 14px;
		border-radius: 6px;
		border: 1px solid #cecece;
		background-color: #000;
		color: #fff;
		transition: all 0.2s;
		&:hover {
			opacity: 0.8;
		}
		&:disabled {
			cursor: default;
			opacity: 0.8;
			&:hover {
				opacity: 0.8;
			}
		}
	}
	.last-item {
		position: absolute;
		right: 8px;
	}
</style>
