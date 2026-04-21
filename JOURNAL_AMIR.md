# Mise en place de Supabase

### Informations du service déployé

- **Project URL :** `https://ooibcbbdfvklegodiwlt.supabase.co`
- **API URL :** `https://ooibcbbdfvklegodiwlt.supabase.co`
- **Anon Key :** `sb_publishable_40sPgHSeXSvpKT1b-0WiLw_974PZhEl`

### Aperçu du Dashboard et des Tables

_(Insérer les captures d'écran ici)_

- **Dashboard Supabase :** [Capture_Dashboard.png]
- **Table Profiles :** [Capture_Profiles.png]
- **Table Tasks :** [Capture_Tasks.png]

---

### Correction de l'erreur d'insertion SQL

Lors de l'insertion des données de test, la requête a échoué avec l'erreur :

> `ERROR: 42804: column "assigned_to" is of type uuid but expression is of type text`

**Cause :** PostgreSQL interprétait les IDs comme du texte simple au lieu du type UUID lors de l'utilisation de `UNION ALL`.

**Solution :** J'ai dû ajouter un cast explicite `::uuid` à chaque identifiant pour forcer le bon type de données et permettre l'insertion.
_Exemple :_ `'2ce49e5f...'::uuid`
