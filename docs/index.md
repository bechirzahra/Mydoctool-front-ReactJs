# Index

### Structure des dossiers

- `/config`: Contient le fichier de paramètres qui change selon l'environnement de développement
- `/dist`: Contient la librairie compilée et minifiée via Webpack
- `/docs`: La documentation
- `/node_modules`: Les modules tiers
- `/raw-html`: Les différents écrans intégrés. Ce répertoire n'est pas utilisé par l'application, il s'agit d'une sauvegarde du travail effectué par Aurélien.
- `/src`: L'ensemble du code source utilisé pour l'application

#### Le dossier `/src`

La structure du dossier reprend la structure de l'architecture Flux (https://facebook.github.io/flux/docs/overview.html)


##### Le dossier '/components'

Ce dossier comporte tous les composants (i.e. les pages ou les templates) utilisés par l'application.

```
./src/components
+-- admin   # Les fichiers de la zone d'Administration (back-office MyDocTool)
+-- app     # Les fichiers partagés entre Médecin et Patient (Account, BaseDashboard, Messages)
+-- auth    # Login, Register, tout ce qui touche à l'authentification
+-- common  # Tous les fichiers partagés (Formulaires...)
+-- manager # La partie médecin
+-- patient # La partie patient
+-- website # Utilisé pour faire un test d'authentification
```