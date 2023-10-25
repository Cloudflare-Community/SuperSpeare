import { mkdir, readdir } from "fs/promises";

const ingest_url = "https://superspeare-ingest.alastair-technologies.workers.dev";
declare module "bun" {
	interface Env {
		SECRET: string;
	}
}

const allPlays = await readdir("source");

// For Debugging
// await mkdir("debug", { recursive: true });

const defaultSuffix = "_TXT_FolgerShakespeare.txt";

for (let i = 0; i < allPlays.length; i++) {
	const play_name = allPlays[i].replace(defaultSuffix, "");
	console.log(`Uploading #${i} of ${allPlays.length}: ${play_name}...`);
	const file = await Bun.file("source/" + play_name + defaultSuffix).text();

	let is_header = true;
	const cleaned_lines = file
		.split("\n")
		.reduce((acc, line, index) => {
			// Remove all lines stating with ACT [number]
			if (line.match(/ACT \d+/g)) {
				is_header = false;
				return acc;
			}
			// Remove all lines stating with Scene [number]
			if (line.match(/Scene \d+/)) {
				return acc;
			}
			// Remove all lines that are just = (These are after the Scene and ACT headers)
			if (line.match(/^=+/)) {
				return acc;
			}
			// Remove all parts that are only uppercase (these introduce characters)
			line = line.replace(/^([A-Z\']{3,} ?)+/, "").trim();
			if (line === "") {
				return acc;
			}
			// If we have not encountered the first ACT, we are in the header. Skip.
			if (is_header) {
				return acc;
			}
			acc.push({ index, value: line });
			return acc;
		}, [] as { index: number; value: string | null }[]);
	// For debugging
	// await Bun.write(`debug/${play_name}.txt`, cleaned_lines.map(a => a.value).join("\n"));

	for (let i = 0; i < cleaned_lines.length; i += 50) {
		console.log("Batch " + i);
		const slice = cleaned_lines.slice(i, i + 50);
		let response = await fetch(ingest_url + "/embeddings", {
			headers: {
				authorization: process.env.SECRET,
			},
			body: JSON.stringify({
				sourceId: play_name,
				stories: slice,
			}),
			method: "POST",
		});

		console.log(await response.text());
		if (!response.ok) {
			throw new Error("Failed to send to ingest");
		}
	}

	console.log("Done. Uploading entire script...");

	let response = await fetch(ingest_url + "/upload_script/" + play_name, {
		headers: {
			authorization: process.env.SECRET,
		},
		method: "POST",
		body: file
	});
	if (!response.ok) {
		throw new Error("Failed to send to ingest");
	}
}