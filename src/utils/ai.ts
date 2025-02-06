import OpenAI from "openai";

const RuntimeConfig = useRuntimeConfig();

export async function generateSummary(description: string) {
	console.info("AI 生成摘要中...");

	// 获取多个 AI 配置
	const aiHosts = RuntimeConfig.AI_HOSTS || [];
	const aiTokens = RuntimeConfig.AI_TOKENS || [];
	const aiModels = RuntimeConfig.AI_MODELS || [];

	if (aiHosts.length === 0 || aiTokens.length === 0 || aiModels.length === 0) {
		console.error("AI 配置缺失，请检查 AI_HOSTS、AI_TOKENS 和 AI_MODELS");
		return "摘要生成失败";
	}

	for (let i = 0; i < aiHosts.length; i++) {
		const host = aiHosts[i];
		const token = aiTokens[i] || aiTokens[0]; // 备用 token
		const model = aiModels[i] || aiModels[0]; // 备用 model

		try {
			console.info(`尝试使用 AI 服务器: ${host} (模型: ${model})`);
			const openai = new OpenAI({
				baseURL: host,
				apiKey: token,
			});

			const response = await openai.chat.completions.create({
				model,
				messages: [
					{
						role: "system",
						content: "你是一个专业的中文博文摘要助手，请阅读以下博文内容，并以简洁流畅的语言生成一段准确且完整的摘要。摘要应突出重点，信息完整，避免冗余，不使用条列式表达，严格按照原文内容进行总结，不捏造、揣测作者观点和文章表达事实，以及不要出现过度转换文章摘要、不要出现过度幻觉、以及提及无关内容，忽略文章中不被markdown标签包裹的代码段，不添加个人观点或主观判断，仅输出摘要内容。限制在80至120字左右",
					},
					{
						role: "user",
						content: `请总结以下内容：${description}`,
					},
				],
				temperature: 0.2,
			});

			return response.choices[0].message.content || "摘要生成失败";
		} catch (error) {
			console.error(`AI 服务器 ${host} 请求失败，尝试下一个...`, error);
		}
	}

	return "所有 AI 服务器均不可用，摘要生成失败";
}
