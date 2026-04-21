import { signIn } from "./auth.js";
import "dotenv/config";
import { createTask, updateTaskStatus, addComment } from "./tasks.js";
import { supabase } from "./client.js";
import { subscribeToProject } from "./realtime.js";

await signIn("bob@gmail.com", "Test123");

const PROJECT_ID = process.env.PROJECT_ID;

const { data: { user } } = await supabase.auth.getUser();

// Bob s'abonne au projet pour que sa présence soit visible par Alice
const unsub = subscribeToProject(PROJECT_ID, {});

const task = await createTask(PROJECT_ID, {
	title: "Implémenter le Realtime",
	priority: "high",
	assignedTo: user.id, // Bob s'auto-assigne la tâche pour que "tasks_read" la laisse passer !
	// fileUrl et fileName seraient renseignés après un upload Uploadthing
});

await new Promise((r) => setTimeout(r, 1000));
await updateTaskStatus(task.id, "in_progress");

await new Promise((r) => setTimeout(r, 1000));
await addComment(task.id, "Je commence maintenant !");

// Laisser le temps à l'événement de partir avant de fermer
await new Promise((r) => setTimeout(r, 500));
unsub();
