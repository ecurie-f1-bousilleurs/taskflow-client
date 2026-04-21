# 2.3 Row Level Security

La policy "members_read" sur la table "project_members" causait une boucle infinie. 
Postgres doit appliquer les règles RLS au SELECT sur project_members. Donc pour vérifier si l'utilisateur a le droit de lire, ça fait un SELECT qui déclenche à nouveau la règle de sécurité, qui refait un SELECT, qui déclenche la règle, etc.
Je l'ai remplacé par une policy qui permet à l'utilisateur de lire les membres d'un projet s'il est membre de ce projet.

```sql
DROP POLICY "members_read" ON project_members;

CREATE POLICY "members_read" ON project_members FOR SELECT
  USING (user_id = auth.uid());
```
Après ça, le test-rls passait. Mais Alice n'avait accès à aucune task

![test RLS](test-rls.png)

Cela était dû au fait qu'alice n'était pas membre dans le projet, après l'avoir ajouter au projet avec:

```sql
insert into public.project_members (project_id, user_id, role) 
values (
  (select id from public.projects where name = 'Refonte API'), 
  '14dce618-1b37-4b50-b6ba-aa7153426365'::uuid, 
  'admin'
);
````

Elle avait accès à 3 tasks, incluant celle de Bob 
![Passing test RLS](test-rls-2.png)

après avoir ajouter 
```sql AND (assigned_to = auth.uid())) ````

à 
```sql
alter policy "tasks_read"

on "public"."tasks"

to public

using ( ((project_id IN ( SELECT project_members.project_id
   FROM project_members
  WHERE (project_members.user_id = auth.uid()))) AND (assigned_to = auth.uid()))
);````

Alice n'avait accès qu'à ses tasks.

![Passing test RLS](passing-test-rls.png)