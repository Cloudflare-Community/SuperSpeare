<script lang="ts">
	import { onMount } from "svelte";
	import { API_URL, Loading } from "$lib";

	export let name: string;
	export let line_index: number;

	let play_data: Promise<{
		title: string;
		author: string;
		lines: { text: string; index: number }[];
	}> | null = null;

	async function fetch_data() {
		let response = await fetch(API_URL + "/full_text?name=" + name);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		let data = await response.text();

		const lines = data.split("\n").map((v, i) => {
			return { text: v, index: i };
		});


		const title = lines.shift()?.text || "Not found";
		const author = lines.shift()?.text || "";

		return { title, author, lines };
	}

	async function syncData() {
		play_data = fetch_data();
		await play_data;
		let interval = setTimeout(() => {
			const el = document.getElementById(`ln${line_index - 10}`);
			if (el) {
				el.scrollIntoView();
				clearInterval(interval);
			}
		}, 10);	
	}

	onMount(async () => syncData());

	$: if (line_index) {
		syncData();
	}
</script>

<div class="sm:m-10 w-[100%] parchment-popup bg-white sm:bg-transparent p-3 sm:p-0">
	{#if !play_data}
		<Loading className="text-5xl">Loading</Loading>
	{:else}
		{#await play_data}
			<Loading className="text-5xl">Loading</Loading>
		{:then play_data}
			<h1 class="text-5xl mt-10">{play_data.title}</h1>
			<h2 class="text-3xl mb-10">{play_data.author}</h2>

			<div class="text-2xl">
				{#each play_data.lines as line}
					{#if line.text === "\r"}
						<br />
					{:else if line.text.startsWith("https://")}
						<a class="underline text-sky-500" href={line.text}>{line.text}</a>
					{:else}
						<p
							id={`ln${line.index}`}
							class={`w-full sm:w-max ${line.index === line_index ? "bg-yellow-300" : ""}`}
						>
							{line.text}
						</p>
					{/if}
				{/each}
			</div>
		{:catch error}
			<p class="text-red-500">{error.message}</p>
		{/await}
	{/if}
</div>
