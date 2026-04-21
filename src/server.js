import express from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./upload.js";

const app = express();

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use(
	"/api/uploadthing",
	createRouteHandler({
		router: uploadRouter,
		config: {
			token: process.env.UPLOADTHING_TOKEN,
			logLevel: "Debug",
			logFormat: "pretty",
			callbackUrl: process.env.CALLBACK_URL ?? "http://localhost:3000",
		},
	}),
);

app.listen(3000, () => {
	console.log("Server started on port 3000");
});
