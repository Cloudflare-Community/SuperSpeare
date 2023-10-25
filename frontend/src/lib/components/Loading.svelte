<script lang="ts">
	import { onMount } from "svelte";

	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	export let className: string = "text-2xl";

	let ellipses = "";

	onMount(async () => {
		while(true) {
			for(let i = 0; i < 3; i++) {
				ellipses += ".";
				await sleep(250);
			}
			ellipses = "";
		}
	});
</script>
<p class={ className }><slot />{ ellipses }</p>