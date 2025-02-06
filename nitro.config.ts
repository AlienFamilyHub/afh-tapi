import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

// 解析 JSON 格式的数组
const parseEnvArray = (envVar, defaultValue = []) => {
	try {
		return envVar ? JSON.parse(envVar) : defaultValue;
	} catch (error) {
		console.error(`Error parsing env variable: ${envVar}`, error);
		return defaultValue;
	}
};

const runtimeEnv = {
	JWT_SECRET: process.env.JWT_SECRET,
	MONGO_HOST: process.env.MONGO_HOST,
	MONGO_PORT: process.env.MONGO_PORT,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASSWORD: process.env.MONGO_PASSWORD,
	AI_HOSTS: parseEnvArray(process.env.AI_HOSTS),
	AI_TOKENS: parseEnvArray(process.env.AI_TOKENS),
	AI_MODELS: parseEnvArray(process.env.AI_MODELS),
};

export default defineNitroConfig({
	srcDir: "src",
	compatibilityDate: "2024-12-04",
	routeRules: {
		"/**": { cors: true, headers: { server: "Nitro.js" } },
		"/favicon.png": { static: true },
		"/favicon.ico": { redirect: "/favicon.png" },
	},
	alias: {
		"@": fileURLToPath(new URL("./src", import.meta.url)),
	},
	runtimeConfig: {
		...runtimeEnv,
		public: {
			baseURL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://api-space.tnxg.top",
		},
	},
	experimental: {
		tasks: true,
	},
	scheduledTasks: {
		"0 0-23/2 * * *": ["crawler:run"],
	},
});
