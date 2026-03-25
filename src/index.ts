import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { tasksRouter } from "./endpoints/tasks/router";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DummyEndpoint } from "./endpoints/dummyEndpoint";
import { ipRouter } from "./endpoints/ip/router";
import { serverDataRouter } from "./endpoints/server-data/router";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
	if (err instanceof ApiException) {
		// If it's a Chanfana ApiException, let Chanfana handle the response
		return c.json(
			{ success: false, errors: err.buildResponse() },
			err.status as ContentfulStatusCode,
		);
	}

	console.error("Global error handler caught:", err); // Log the error if it's not known

	// For other errors, return a generic 500 response
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

// Register Tasks Sub router (legacy)
openapi.route("/tasks", tasksRouter);

// Register other endpoints (legacy)
openapi.post("/dummy/:slug", DummyEndpoint);

// Export the Hono app
export default app;
