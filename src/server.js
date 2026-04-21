import "dotenv/config";
import express from "express";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./upload.js";

const app = express();
import multer from "multer";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "Aucun fichier fourni" });
		}

		const file = new File([req.file.buffer], req.file.originalname, {
			type: req.file.mimetype,
		});

		const response = await utapi.uploadFiles(file);
		res.json(response);
	} catch (error) {
		console.error("Erreur serveur:", error);
		res.status(500).json({ error: error.message, stack: error.stack });
	}
});

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
