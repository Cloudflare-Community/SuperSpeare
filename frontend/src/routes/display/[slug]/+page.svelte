<script lang="ts">
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const lines = data.text.split("\n").map((v, i) => {
		return { text: v, index: i };
	});
	const title = lines.shift()?.text;
	const author = lines.shift()?.text;

	let found_line_index: number;

	onMount(() => {
		const hash = window.location.hash;
		if (hash) {
			found_line_index = Number(hash.slice(3));
			const el = document.getElementById(`ln${found_line_index - 2}`);
			if (el) {
				el.scrollIntoView();
			}
		}
	});
</script>

<div class="m-20">
	<h1 class="text-5xl mt-10">{ title }</h1>
	<h2 class="text-3xl mb-10">{ author }</h2>

	<div class="text-2xl">
		{#each lines as line}
			{#if line.text === ""}
				<br />
			{:else if URL.canParse(line.text) && line.text.startsWith("https://")}
				<a class="underline text-sky-500" href={line.text}>{line.text}</a>
			{:else}
				<p
					id={`ln${line.index}`}
					class={`w-max ${line.index === found_line_index ? "bg-yellow-300" : ""}`}
				>
					{line.text}
				</p>
			{/if}
		{/each}
	</div>
</div>
