export const GET = async ({ url }) => {
	const query = url.searchParams.get("query");

	if (!query) {
		return new Response("Missing query", { status: 400 });
	}

	const response = await fetch("https://superspeare.cloudflare.community/search?query=" + encodeURIComponent(query));

	return response;
}
