import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const isCopied = writable<boolean>(false);
export const newCardAdded = writable<boolean>(false);
export const setPrimaryCard = writable<boolean>(false);
export const deleteCard = writable<boolean>(false);
export const loader = writable<boolean>(false);

export const retriveDatabases = writable(
  (browser && localStorage.getItem("retriveDatabases")) || false
);
retriveDatabases.subscribe((val) => {
  if (browser) return (localStorage.retriveDatabases = val);
});

