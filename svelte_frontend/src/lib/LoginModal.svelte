<script lang="ts">
	import MainProtected from '~/api/main/protected/MainProtected';
	import Modal from './Modal.svelte';
	import {
		toasts,
		ToastContainer,
		FlatToast,
		BootstrapToast,
	} from 'svelte-toasts';

	export let showModal: boolean = false;
	export let dialog: HTMLDialogElement;
	export let loggedIn: boolean = false;
	export let fetchData: (page: number) => Promise<void>;

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

	let loginNick: string;
	let loginPass: string;
	let signUpNick: string;
	let signUpPass: string;
	let signUpEmail: string;

	const signUp = async () => {
		const data = {
			username: signUpNick,
			email: signUpEmail,
			password: signUpPass,
		};
		const res = await MainProtected.signup(data);
		if (res.user) {
			showToast('Youre successfully registred!');
			signUpNick = '';
			signUpEmail = '';
			signUpPass = '';
		} else {
			showError(res.message);
		}
	};

	const login = async () => {
		const data = {
			username: loginNick,
			password: loginPass,
		};
		const res = await MainProtected.login(data);
		if (res.token) {
			localStorage.setItem('accessToken', res.token);
			showToast('You successfully loginned!');
			loggedIn = true;
			fetchData(1);
			dialog.close();
			loginNick = '';
			loginPass = '';
		} else {
			showError(res.message);
		}
	};
</script>

<Modal bind:showModal bind:dialog>
	<div class="wrapper">
		<div class="section">
			<h2>Login</h2>
			<div class="record">
				<span>Username</span>
				<input
					autocomplete="username"
					type="string"
					placeholder="Enter your username..."
					bind:value={loginNick}
				/>
			</div>
			<div class="record">
				<span>Password</span>
				<input
					autocomplete="current-password"
					type="password"
					placeholder="Enter your password..."
					bind:value={loginPass}
				/>
			</div>
			<button disabled={!loginPass || !loginNick} on:click={login}>Login</button
			>
		</div>
		<div class="divider">
			<div class="line" />
			<span>OR</span>
			<div class="line" />
		</div>
		<div class="section">
			<h2>Sign Up</h2>
			<div class="record">
				<span>Email</span>
				<input
					type="email"
					placeholder="Enter your email..."
					bind:value={signUpEmail}
				/>
			</div>
			<div class="record">
				<span>Username</span>
				<input
					type="string"
					placeholder="Enter your username..."
					bind:value={signUpNick}
				/>
			</div>
			<div class="record">
				<span>Password</span>
				<input
					type="password"
					placeholder="Enter your password..."
					bind:value={signUpPass}
				/>
			</div>
			<button
				disabled={!signUpEmail || !signUpNick || !signUpPass}
				on:click={signUp}>Sign Up</button
			>
		</div>
	</div>
</Modal>

<ToastContainer let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	:root {
		& .st-toast-body.svelte-1t011t6 .st-toast-close-btn.svelte-1t011t6 {
			background: transparent !important;
			border: none !important;
			display: flex !important;
			align-items: center !important;
			top: 12px !important;
			justify-content: center !important;
			cursor: pointer;
		}
		& .st-toast-body.st-toast-no-title.svelte-1t011t6.svelte-1t011t6 {
			font-family: 'Inter', sans-serif;
			display: flex;
			align-items: center;
			gap: 5px;
		}
	}
	.wrapper {
		display: flex;
		width: 100%;
		padding: 12px;
		flex-direction: column;
		box-sizing: border-box;
		gap: 20px;
	}
	h2 {
		font-weight: 500;
		margin: 0;
		margin-bottom: 10px;
	}
	.section {
		width: 100%;
		display: flex;
		gap: 5px;
		flex-direction: column;
		align-items: center;
	}
	.record {
		display: flex;
		flex-direction: column;
		gap: 4px;
		& span {
			color: #0e0e0e;
			font-size: 12px;
		}
		& input {
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
			&:disabled {
				opacity: 0.5;
			}
		}
		& p {
			margin-top: 6px;
		}
	}
	.divider {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.line {
		background-color: #0e0e0e;
		height: 1px;
		width: 100%;
	}
	button {
		cursor: pointer;
		margin-top: 10px;
		height: 38px;
		font-size: 17px;
		width: 70%;
		text-transform: uppercase;
		padding: 0;
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
</style>
