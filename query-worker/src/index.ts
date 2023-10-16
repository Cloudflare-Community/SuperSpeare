import { Ai } from "@cloudflare/ai";

interface EmbeddingResponse {
	shape: number[];
	data: number[][];
}

const cache = caches.default;

export default <ExportedHandler<Environment>>{
	async fetch(req, env, ctx) {
		try {
			const cached = await cache.match(req);
			if (cached) {
				return cached;
			}
			const ai = new Ai(env.AI);

			const { searchParams } = new URL(req.url);
			const query = searchParams.get("query");

			if (!query) {
				return Response.json({ error: "No query provided" }, { status: 400 });
			}

			const modelResp: EmbeddingResponse = await ai.run("@cf/baai/bge-base-en-v1.5", { text: query });

			const inserted = await env.VECTORIZE.query(modelResp.data[0], { returnVectors: true });

			// Commiting crimes

			const response = Response.json({
				count: inserted.count,
				matches: inserted.matches.map((match) => {
					return {
						// WITH BOTH DIRECTION
						vectorId: match.vectorId,
						// AND MAGNITUDE
						score: match.score,
						// OH YEAH!!!
						metadata: match.vector?.metadata,
					};
				}),
			}, {
				headers: {
					"cloudflare-cdn-cache-control": "max-age=3600",
				},
			});

			ctx.waitUntil(cache.put(req, response.clone()));
			return response;
		} catch (e) {
			return Response.json(e, { status: 500 });
		}
	},
};
