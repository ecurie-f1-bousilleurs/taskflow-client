# 2.3 Row Level Security

La policy "members_read" sur la table "project_members" causait une boucle infinie. 
Postgres doit appliquer les règles RLS au SELECT sur project_members. Donc pour vérifier si l'utilisateur a le droit de lire, ça fait un SELECT qui déclenche à nouveau la règle de sécurité, qui refait un SELECT, qui déclenche la règle, etc.
Je l'ai remplacé par une policy qui permet à l'utilisateur de lire les membres d'un projet s'il est membre de ce projet.

```sql
DROP POLICY "members_read" ON project_members;

CREATE POLICY "members_read" ON project_members FOR SELECT
  USING (user_id = auth.uid());
```
Après ça, le test-rls passait 

![Passing test RLS](test-rls.png)