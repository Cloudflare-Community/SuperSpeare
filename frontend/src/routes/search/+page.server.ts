import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get("query");

	if (!query) {
		throw error(400, "No query provided");
	}

	const response = await fetch("https://superspeare.cloudflare.community/search?query=" + encodeURIComponent(query));

	return response.json<Result>();
}
