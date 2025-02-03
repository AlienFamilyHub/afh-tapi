export default eventHandler(async () => {
	const res = await runTask("crawler:run");

	if (res.result === "success") {
		const response: ApiResponse = {
			code: "200",
			status: "success",
		};
		return response;
	}
	else {
		const response: ApiResponse = {
			code: "500",
			status: "error",
		};
		return response;
	}
});
