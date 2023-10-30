<script lang="ts">
	export let title: string;
	export let url: string;
	export let description: string;
</script>

<title>{ title }</title>
<meta name="title" content={ title } />
<meta name="theme-color" content="#D2B48C" />
<meta name="description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={ url } />
<meta property="og:title" content={ title } />
<meta property="og:description" content={description} />
<meta property="og:site_name" content="Zeggy and Allie">
<meta property="og:image" content="https://superspeare.cloudflare.community/shakespeare.png" />
<meta property="twitter:card" content="summary" />
<meta property="twitter:url" content={ url } />
<meta property="twitter:title" content={ title } />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content="https://superspeare.cloudflare.community/shakespeare.png" />