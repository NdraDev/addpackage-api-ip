import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { ipRouter } from "./endpoints/ip/router";
import { serverDataRouter } from "./endpoints/server-data/router";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	if (err instanceof ApiException) {
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	console.error("Global error handler caught:", err);

	return c.json(
		{
			success: false,
			errors: [{ code: 7000, message: "Internal Server Error" }],
		},
		500,
	);
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
	schema: {
		info: {
			title: "AddPackage API - IP Management",
			version: "1.0.0",
			description: "API untuk mengelola IP addresses dan server data",
		},
	},
});

// Register IP router
openapi.route("/api", ipRouter);

// Register Server Data router
openapi.route("/api", serverDataRouter);

// Export the Hono app
export default app;
