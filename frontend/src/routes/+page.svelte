<script lang="ts">
	import { SearchResult, API_URL, Loading, FullText } from "$lib";
	import { onMount } from "svelte";

	const fun_quotes = ["What, you egg?", "He stabs him", "You Saucy Boy"];

	let result: Promise<Result> | null = null;
	let selectedMatch: Match | null = null;
	let query: string = "";

	const search = async () => {
		result = fetch(`${API_URL}/search?query=${encodeURIComponent(query)}`).then((e) =>
			e.json<Result>(),
		);
		const params = new URLSearchParams(window.location.search);
		params.set("query", query);
		window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
	};

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const param = params.get("query");
		if (param) {
			query = param;
			search();
		}
	});

	function loadMatch(match: Match) {
		selectedMatch = match;
	}
</script>

<div class="flex justify-between" on:mouseup={() => {
	if (selectedMatch !== null  && window.innerWidth < 640) {
		selectedMatch = null;
	}
}} role="button" tabindex="0">
	<div class="w-full sm:w-[50vw]">
		<h1 class="text-4xl sm:text-6xl italic">Welcome to SuperSpeare</h1>
		<p class="text-md sm:text-2xl">
			Enter your favorite Spakespeare quote and see what play it's from! <a
				href="/about"
				class="underline text-sky-500">Learn more</a
			>
		</p>
		<div class="flex justify-between w-[75vw] sm:w-[35rem]">
			<input
				name="query"
				type="text"
				class="text-2xl border-2 w-3/4 sm:w-[30rem]"
				placeholder={fun_quotes[Math.floor(Math.random() * fun_quotes.length)]}
				on:keypress={(e) => {
					if (e.key === "Enter") {
						search();
					}
				}}
				bind:value={query}
			/>
			<button class="px-2 py-1 bg-red-400 border-1 border-black rounded-lg" on:click={search}>Search!</button>
		</div>
		{#if !result}
			<p class="text-5xl">Enter text to search!</p>
		{:else}
			{#await result}
				<Loading>Searching</Loading>
			{:then result}
				<h1 class="my-10 text-5xl">Search results:</h1>
				{#each result.matches as match}
					<SearchResult {match} addFullText={loadMatch}></SearchResult>
				{/each}
			{/await}
		{/if}
	</div>
	{#if selectedMatch !== null}
		<div class="z-1 absolute sm:relative overflow-scroll h-[1510px] w-[90vw] sm:w-6/12 sm:mr-2">
			<FullText name={selectedMatch.metadata.sourceId} line_index={selectedMatch.metadata.index} />
		</div>
	{/if}
</div>
