<script lang="ts">
	import { Link } from "$lib";

	let heading = "About Superspeare (serious)";
	const enter = (e: MouseEvent) => {
		heading =
			Math.random() > 0.8
				? "About SuperConnectivitySpeare (serious)"
				: "About ConnectivitySpeare (serious)";
	};
	const leave = (e: MouseEvent) => {
		heading = "About SuperSpeare (serious)";
	};
</script>

<div class="h-screen">
	<h1 class="text-8xl" on:mouseenter={enter} on:mouseleave={leave}>{heading}</h1>
	<h2 class="text-4xl mt-3 mb-1">The project</h2>
	<p>
		This project is built on top of Cloudflare AI, Vectorize, Pages and Workers. It uses <code
			class="text-sm">@cf/baai/bge-base-en-v1.5</code
		>
		running on <Link href="https://developers.cloudflare.com/workers-ai/">Workers AI</Link> to generate
		embeddings, then stores those in <Link href="https://developers.cloudflare.com/vectorize/"
			>Vectorize</Link
		>. The frontend is running on Cloudflare Pages and functions, and the backend runs on Workers.
	</p>
	<h2 class="text-4xl mt-3 mb-1">Made by</h2>
	<p>
		<Link href="https://zegs.me/posts/superspeare">Zeggy</Link> and <Link
			href="https://www.goalastair.com/en/blog/NVRVx15bFcunz2nj">Allie</Link
		>
	</p>
	<h2 class="text-4xl mt-3 mb-1">Acknowledgements</h2>
	<p>
		The Shakespeare text was obtained from <Link
			href="https://www.folger.edu/explore/shakespeares-works">Folger Shakespeare Library</Link
		>, licenced under <Link href="https://creativecommons.org/licenses/by-nc/3.0/">CC BY-NC 3.0 DEED</Link> (<Link href="https://www.folger.edu/copyright-policy/">FSL Copyright Policy</Link
		>). The only changes made are to formatting.
	</p>
</div>
