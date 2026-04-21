import { signIn, signOut, signUp } from "./auth.js";
import { supabase } from "./client.js";

// Test 1 : sans auth → tout vide
const { data: noAuth, error: noAuthError } = await supabase
	.from("tasks")
	.select("*");
if (noAuthError) {
	console.log("Sans auth erreur:", noAuthError.message);
} else {
	console.log("Sans auth:", noAuth?.length, "(attendu: 0)");
}

// Test 2 : Alice voit ses tâches
try {
	await signIn("alice@gmail.com", "Test123");
} catch (err) {
	if (err.message === "Invalid login credentials") {
		console.log("Alice n'existe pas encore. Création du compte...");
		try {
			await signUp("alice@gmail.com", "Test123", "alice", "Alice Doe");
			await signIn("alice@gmail.com", "Test123");
		} catch (signUpErr) {
			if (signUpErr.code === "user_already_exists") {
				await signIn("alice@gmail.com", "Test123");
			} else if (signUpErr.status === 429) {
				console.error(
					"Vous avez atteint la limite d'envois d'emails de Supabase.",
				);
				process.exit(1);
			} else {
				throw signUpErr;
			}
		}
	} else {
		throw err;
	}
}

const { data: membership } = await supabase.from("project_members").select("*");
console.log("Projets d'Alice :", membership?.length || 0, membership);

const { data: tasks, error: tasksError } = await supabase
	.from("tasks")
	.select("*");
if (tasksError) {
	console.log("Erreur requête Alice:", tasksError.message);
} else {
	console.log("Tasks Alice:", tasks?.length);
}
// Test 3 : Alice ne peut pas modifier la tâche de Bob
const { data: bobTask } = await supabase
	.from("tasks")
	.select("id")
	.eq("assigned_to", "UUID-USER-2")
	.single();
const { error } = await supabase
	.from("tasks")
	.update({ title: "Hacked" })
	.eq("id", bobTask?.id);
console.log("Modif refusée:", error?.message ?? "ERREUR : accès accordé !");
await signOut();
