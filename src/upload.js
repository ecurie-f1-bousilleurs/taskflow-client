// upload.js – client Uploadthing simplifié
import { createUploadthing } from "uploadthing/server";

const f = createUploadthing();

// Définir les types de fichiers acceptés
export const uploadRouter = {
	taskAttachment: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
		pdf: { maxFileSize: "8MB", maxFileCount: 1 },
	})
		.middleware(async ({ req }) => {
			// Vérifier que l'user est connecté
			const token = req.headers["authorization"]?.replace("Bearer ", "");
			if (!token) throw new Error("Non authentifié");
			return { token };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return { url: file.url, name: file.name };
		}),
};
