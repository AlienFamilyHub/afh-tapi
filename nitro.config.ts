import process from "node:process";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const runtimeEnv = {
	JWT_SECRET: process.env.JWT_SECRET,
	MONGO_HOST: process.env.MONGO_HOST,
	MONGO_PORT: process.env.MONGO_PORT,
	MONGO_USER: process.env.MONGO_USER,
	MONGO_PASSWORD: process.env.MONGO_PASSWORD,
	AI_HOST: process.env.AI_HOST,
	AI_TOKEN: process.env.AI_TOKEN,
	AI_MODEL: process.env.AI_MODEL,
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
