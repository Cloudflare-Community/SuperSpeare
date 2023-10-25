
<script lang="ts">
  import SearchResult from '../../components/SearchResult.svelte';

	import type { PageData } from "./$types";
	
	export let data: PageData;
	console.log(data);
</script>

<h1>Your search results!</h1>

<div class="">
	{#each data.matches as match}
	<SearchResult match={match}></SearchResult>
	{/each}
</div>