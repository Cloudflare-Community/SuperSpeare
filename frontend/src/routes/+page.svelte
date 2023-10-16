<script lang="ts">
	const fun_quotes = ["What, you egg?", "He stabs him", "You Saucy Boy"];
</script>

<h1 class="text-4xl italic">Welcome to SuperSpeare</h1>
<p>Enter your favorite Spakespeare quote and see what play it's from!</p>
<form method="GET" action="/results">
	<input name="query" type="text" placeholder={
		fun_quotes[Math.floor(Math.random() * fun_quotes.length)]
	}>
</form>