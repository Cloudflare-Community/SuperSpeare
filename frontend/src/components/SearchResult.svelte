<script lang="ts">
	export let match: Match;

</script>

<h2 class="text-3xl">{match.metadata.text}</h2>
<p class="text-xl italic text-orange-400">{match.metadata.sourceId}</p>
<a href={`/display/${match.metadata.sourceId}#ln${match.metadata.index}`}>Click here to redirect!</a>

