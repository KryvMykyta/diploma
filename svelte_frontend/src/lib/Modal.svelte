<script lang="ts">
	export let showModal: boolean;

	export let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
	$: if (dialog && !showModal) dialog.close();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click={() => dialog.close()}
>
	<div
		on:click|stopPropagation
		role="button"
		tabindex="0"
		on:keydown={() => {}}
	>
		<slot />
	</div>
</dialog>

<style>
	dialog {
		z-index: 2;
		min-width: 450px;
		border-radius: 6px;
		border: none;
		padding: 0;
		margin: auto;
    background-color: #f9f9f9;
	}
	dialog::backdrop {
		z-index: 3;

		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
