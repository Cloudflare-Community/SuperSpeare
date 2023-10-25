import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ url, params }) => {
	const response = await fetch("https://superspeare.cloudflare.community/full_text?name=" + encodeURIComponent(params.slug));

	return {
		text: response.text()
	};
}
