module.exports = {
	apps: [
		{
			name: "afh-tapi",
			script: "pnpm",
			args: "preview",
			cwd: "./",
			instances: 1,
			exec_mode: "fork",
			env: {
				NODE_ENV: "development PORT=1142",
			},
			env_production: {
				NODE_ENV: "production PORT=1142",
			},
			log_date_format: "YYYY-MM-DD HH:mm:ss",
			error_file: "./logs/preview-error.log",
			out_file: "./logs/preview-out.log",
			merge_logs: true,
			max_memory_restart: "1G",
		},
	],
};
