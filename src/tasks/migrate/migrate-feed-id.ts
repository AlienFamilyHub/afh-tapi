import crypto from "node:crypto";
import { db_read, db_update } from "../../utils/db";

export default defineTask({
	async run() {
		try {
			// 读取所有现有的文章
			const feeds = await db_read("afh-tapi", "feeds", {});
			console.info(`找到 ${feeds.length} 条文章需要迁移`);

			let successCount = 0;
			let failCount = 0;

			for (const feed of feeds) {
				const oldId = feed.id;
				const newId = crypto.createHash("md5").update(feed.link || "").digest("hex");

				// 如果新旧ID相同，跳过更新
				if (oldId === newId) {
					console.info(`文章 ${feed.title} 的ID无需更新`);
					continue;
				}

				// 检查新ID是否已存在
				const existing = await db_read("afh-tapi", "feeds", { id: newId });
				if (existing.length > 0) {
					console.warn(`文章 ${feed.title} 的新ID ${newId} 已存在，跳过更新`);
					failCount++;
					continue;
				}

				// 更新文章ID
				const success = await db_update("afh-tapi", "feeds", { id: oldId }, { id: newId });
				if (success) {
					console.info(`文章 ${feed.title} 的ID已从 ${oldId} 更新为 ${newId}`);
					successCount++;
				} else {
					console.error(`更新文章 ${feed.title} 的ID失败`);
					failCount++;
				}
			}

			console.info(`迁移完成：成功 ${successCount} 条，失败 ${failCount} 条`);
			return { result: "success", successCount, failCount };
		} catch (error) {
			console.error("迁移过程出错:", error);
			return { result: "failed", error: String(error) };
		}
	},
});
