import { Ai } from "@cloudflare/ai";

interface EmbeddingResponse {
	rshape: number[];
	data: number[][];
}

export default <ExportedHandler<Environment>>{
	async fetch(req, env) {
		try {
			const authHeader = req.headers.get("authorization");
			if (authHeader !== env.SECRET) {
				return new Response("Unauthorized", { status: 401 });
			}

			if (req.method !== "POST") {
				return new Response("Method not allowed", { status: 405 });
			}

			const { pathname } = new URL(req.url);
			if (pathname === "/embeddings") {
				const ai = new Ai(env.AI);

				const answer = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
					messages: [
						{ content: "Yo", role: "e" }
					]
				})

				const input = await req.json<{
					sourceId: string,
					stories: {
						index: number,
						value: string,
					}[]
				}>();

				const modelResp: EmbeddingResponse = await ai.run(
					"@cf/baai/bge-base-en-v1.5",
					{
						text: input.stories.map(a => a.value),
					},
				);

				let inserted = await env.VECTORIZE.upsert(modelResp.data.map((vector, i) => ({
					id: `${input.sourceId}/${input.stories[i].index}`,
					values: vector,
					metadata: {
						sourceId: input.sourceId,
						index: input.stories[i].index,
						text: input.stories[i].value,
					}
				})));

				return Response.json(inserted);
			} else if (pathname.startsWith("/upload_script")) {
				let script = await req.text();
				let path_parts = pathname.split("/");
				let sourceId = path_parts[path_parts.length - 1];
				let inserted = await env.R2.put(sourceId, script);
				return Response.json({ "status": "ok" });
			} else {
				return new Response("Not found", { status: 404 });
			}
		} catch (e) {
			return Response.json(e, {
				status: 500
			});
		}
	},
};
