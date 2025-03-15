export default eventHandler(async (_event) => {
	try {
		const result = await runTask("migrate:migrate-feed-id");
		return result;
	} finally {
		console.warn("migrate:migrate-feed-id");
	}
});
