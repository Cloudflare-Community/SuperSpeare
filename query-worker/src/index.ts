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
			const { searchParams, pathname } = new URL(req.url);

			if (pathname === "/full_text") {
				const name = searchParams.get("name");

				if (!name) {
					return Response.json({ error: "No name provided" }, { status: 400 });
				}

				const response_object = await env.R2.get(name);

				if (!response_object) {
					return Response.json({ error: "Work not found" }, { status: 404 });
				}

				const response = new Response(response_object.body, {
					headers: {
						"access-control-allow-origin": "*",
						"cloudflare-cdn-cache-control": "max-age=3600",
					}
				});

				ctx.waitUntil(cache.put(req, response.clone()));
				return response;
			} else if (pathname === "/search") {
				const ai = new Ai(env.AI);

				const query = searchParams.get("query");

				if (!query) {
					return Response.json({ error: "No query provided" }, { status: 400 });
				}

				const modelResp: EmbeddingResponse = await ai.run("@cf/baai/bge-base-en-v1.5", { text: query });

				const inserted = await env.VECTORIZE.query(modelResp.data[0], { returnVectors: true, topK: 10 });

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
						"access-control-allow-origin": "*",
						"cloudflare-cdn-cache-control": "max-age=3600",
					},
				});

				ctx.waitUntil(cache.put(req, response.clone()));
				return response;
			}
			return Response.json({ error: "Invalid path" }, { status: 404 });
		} catch (e) {
			return Response.json(e, { status: 500 });
		}
	},
};
