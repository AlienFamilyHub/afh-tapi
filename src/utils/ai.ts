import OpenAI from "openai";

const RuntimeConfig = useRuntimeConfig();

export async function generateSummary(description: string) {
	try {
		console.info("AI 生成摘要中...");
		const openai = new OpenAI({
			baseURL: RuntimeConfig.AI_HOST,
			apiKey: RuntimeConfig.AI_TOKEN,
		});

		const response = await openai.chat.completions.create({
			model: RuntimeConfig.AI_MODEL,
			messages: [
				{
					role: "system",
					content: "你是一个专业的中文博文摘要助手，请阅读以下博文内容，并以简洁流畅的语言生成一段准确且完整的摘要。摘要应突出重点，信息完整，避免冗余，不使用条列式表达，不添加个人观点或主观判断，仅输出摘要内容。例如：\n\n【示例摘要】\n本篇博文探讨了[核心主题]，分析了[主要内容]，并强调了[关键要点]。文章指出[重要结论]，并提出[相关影响或建议]。",
				},
				{
					role: "user",
					content: `请总结以下内容：${description}`,
				},
			],
			temperature: 0.3,
		});

		return response.choices[0].message.content || "摘要生成失败";
	}
	catch (error) {
		console.error("AI 生成摘要时出错:", error);
		return "摘要生成失败";
	}
}
