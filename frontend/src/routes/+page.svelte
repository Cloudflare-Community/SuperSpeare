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

<div class="flex justify-between">
	<div class="w-[46rem]">
		<h1 class="text-6xl italic">Welcome to SuperSpeare</h1>
		<p class="text-2xl">
			Enter your favorite Spakespeare quote and see what play it's from! <a
				href="/about"
				class="underline text-sky-500">Learn more</a
			>
		</p>
		<input
			name="query"
			type="text"
			class="text-2xl border-2 w-full"
			placeholder={fun_quotes[Math.floor(Math.random() * fun_quotes.length)]}
			on:keypress={(e) => {
				if (e.key === "Enter") {
					search();
				}
			}}
			bind:value={query}
		/>
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
	<div class="overflow-scroll h-[1510px] w-8/12 mr-2">
		{#if selectedMatch !== null}
			<FullText name={selectedMatch.metadata.sourceId} line_index={selectedMatch.metadata.index} />
		{/if}
	</div>
</div>
