import crypto from "node:crypto";
import Parser from "rss-parser";

interface Feed {
	id: string;
	title: string;
	link: string;
	description: string;
	date: string;
	author: string;
	summary: string | null;
}

const parser = new Parser({
	customFields: {
		item: [
			["title", "title"],
			["link", "link"],
			["created", "date"],
			["pubdate", "date"],
			["dc:date", "date"],
			["published", "date"],
			["pubDate", "date"],
			["updated", "date"],
			["dc:creator", "author"],
			["creator", "author"],
			["author", "author"],
			["content:encoded", "description"],
			["content", "description"],
			["description", "description"],

			["summary", "summary"],
		],
	},
});

async function fetchFeed(url: string): Promise<Feed[]> {
	try {
		const response = await fetch(url, {
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				"Accept": "application/rss+xml, application/xml, text/xml",
			},
		});

		if (!response.ok) {
			console.error(`Failed to fetch feed from ${url}: HTTP ${response.status}`);
			return [];
		}

		const xml = await response.text();
		const feed = await parser.parseString(xml);

		return feed.items.map((item) => {
			const id = crypto.createHash("md5").update((item.title || "") + (item.author || "")).digest("hex");
			const parsedDate = item.date ? new Date(item.date).toISOString() : "";
			return {
				id,
				title: item.title || "",
				link: item.link || "",
				description: item.description || "",
				date: parsedDate,
				author: item.author || feed.title || "Unknown",
				summary: item.summary || null,
			};
		});
	} catch (error) {
		console.error(`Error fetching feed from ${url}:`, error);
		return [];
	}
}

export async function fetchAndSortFeeds(urls: string[]): Promise<Feed[]> {
	const allFeeds: Feed[] = [];

	for (const url of urls) {
		if (!url) {
			console.warn(`Skipping empty URL`);
			continue;
		}
		const feeds = await fetchFeed(url);
		console.info(`Fetched ${feeds.length} items from ${url}`);
		allFeeds.push(...feeds);
	}

	// 确保 `date` 可排序，如果 `date` 为空，则默认 `0`
	return allFeeds.sort((a, b) => {
		const timeA = a.date ? new Date(a.date).getTime() : 0;
		const timeB = b.date ? new Date(b.date).getTime() : 0;
		return timeB - timeA;
	});
}
