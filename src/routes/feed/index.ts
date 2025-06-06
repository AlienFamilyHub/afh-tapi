import { db_read } from "@/utils/db";

export default eventHandler(async (event) => {
	const query = getQuery(event);

	const page = Number.parseInt(String(query.page || "1"), 10);
	const size = Number.parseInt(String(query.size || "50"), 10);

	if (Number.isNaN(page) || page <= 0) {
		const response: ApiResponse = {
			code: "400",
			status: "error",
			message: "Invalid page parameter",
		};

		return new Response(JSON.stringify(response), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	if (Number.isNaN(size) || size <= 0) {
		const response: ApiResponse = {
			code: "400",
			status: "error",
			message: "Invalid size parameter",
		};

		return new Response(JSON.stringify(response), {
			status: 400,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const skip = (page - 1) * size;
	const queryOptions = { skip, limit: size, sort: { date: -1 } }; // 按时间降序排序

	const totalCount = await db_read("afh-tapi", "feeds", {}, {});
	const feeds = await db_read("afh-tapi", "feeds", {}, queryOptions);

	const filteredFeeds = feeds.map(({ description, ...rest }) => rest);

	const total = totalCount.length;
	const totalPages = Math.ceil(total / size);
	const hasNextPage = page < totalPages;
	const hasPrevPage = page > 1;

	const response: ApiResponse = {
		code: "200",
		status: "success",
		data: filteredFeeds,
		message: {
			pagination: {
				total,
				current_page: page,
				total_page: totalPages,
				size,
				has_next_page: hasNextPage,
				has_prev_page: hasPrevPage,
			},
		},
	};

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
});
