import { members } from "../data";

export default defineEventHandler(async (event) => {
	// 获取查询参数
	const query = getQuery(event);
	const type = query.type || query.t;

	// 过滤出有效的博客网址
	const validMembers = members.filter(member => member.website);

	if (validMembers.length === 0) {
		const response: ApiResponse = {
			code: "404",
			status: "error",
			message: "No valid blog URLs found",
		};
		return new Response(JSON.stringify(response), {
			status: 404,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	const randomMember = validMembers[Math.floor(Math.random() * validMembers.length)];

	if (type === "json") {
		const response: ApiResponse = {
			code: "200",
			message: "获取随机成员信息成功",
			status: "success",
			data: {
				...randomMember,
			},
		};
		return new Response(JSON.stringify(response), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} else {
		const targetUrl = new URL(randomMember.website);
		targetUrl.searchParams.set("ref", `afhub`);
		return sendRedirect(event, targetUrl.toString(), 302);
	}
});
