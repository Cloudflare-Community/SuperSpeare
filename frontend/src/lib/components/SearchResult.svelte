<script lang="ts">
	import { formatName } from "$lib";

	export let match: Match;
	export let addFullText: (m: Match) => void;
</script>

<div
	on:click={() => {
		addFullText(match);
	}}
	on:keydown={(e) => {
		if (e.key === "Enter") {
			addFullText(match);
		}
	}}
	aria-label="View full text"
	role="button"
	tabindex="0"
	class="block w-[40rem] bg-slate-100 my-5 px-5 py-5"
>
	<h2 class="text-3xl">"{match.metadata.text}"</h2>
	<div class="flex justify-between">
		<span class="text-xl italic text-orange-400">{formatName(match.metadata.sourceId)}</span>
		<span class="text-xl">View Full Text -></span>
	</div>
</div>
