import { members } from "@/data";
import { generateSummary } from "@/utils/ai";
import { fetchAndSortFeeds } from "@/utils/crawler";
import { db_find, db_insert } from "@/utils/db";

const rssList = members.map(member => member.feed);

export default defineTask({
	meta: {
		name: "crawler:run",
		description: "Run the crawler RSSFetchIntervalTimer",
	},
	async run() {
		try {
			const feeds = await fetchAndSortFeeds(rssList);
			const processedFeeds = [];

			for (const feed of feeds) {
				const existing = await db_find("afh-tapi", "feeds", { id: feed.id });
				if (!existing) {
					console.info("New feed found:", feed.title);
					const summary = await generateSummary(feed.description);
					await new Promise(resolve => setTimeout(resolve, 1000));
					const feedWithSummary = { ...feed, summary };
					await db_insert("afh-tapi", "feeds", feedWithSummary);
					processedFeeds.push(feedWithSummary);
				}
				else {
					console.info("Existing feed found:", feed.title);
				}
			}
			return { result: "success" };
		}
		catch (error) {
			console.error("Error fetching feed:", error);
			return { result: "failed" };
		}
	},
});
