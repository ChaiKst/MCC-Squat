# MCC Squat — Site Vitrine Professionnel (Toulouse & Haute-Garonne)

Site web complet, moderne et haut de gamme conçu pour une entreprise intervenant à **Toulouse et ses environs** dans :

1. **La gestion de maisons squattées** (accompagnement légal via avocat sans recours à la violence, puis sécurisation et réhabilitation après récupération légale du logement).
2. **Le débarras et le vidage de logements** (maisons, appartements, caves, successions, incurie, évacuation en filières agréées).
3. **Le nettoyage approfondi et la remise en état** (assainissement, dégraissage, peintures, petites réparations du second œuvre).
4. **La valorisation immobilière** (décoration sobre, home staging et préparation des biens à la vente).

---

## Architecture des fichiers

```text
valois-intendance-toulouse/
├── index.html                        # Page d'accueil (Proposition de valeur, cas, 4 volets, méthode, zone 31, FAQ)
├── maison-squattee.html              # Page dédiée : Démarches officielles par avocat & intervention post-récupération
├── debarras-vidage.html              # Page dédiée : Enlèvement des meubles, désencombrement, tri & évacuation
├── nettoyage-remise-en-etat.html     # Page dédiée : Nettoyage approfondi, réparations & remise au propre
├── valorisation-immobiliere.html     # Page dédiée : Décoration, home staging & préparation à la vente
├── contact-devis.html                # Page dédiée : Formulaire de qualification du bien (transmission réelle)
├── site-config.json                  # Données centralisées de l'entreprise au format JSON
├── sitemap.xml                       # Plan du site XML pour l'indexation SEO
├── robots.txt                        # Directives d'indexation moteurs de recherche
└── assets/
    ├── css/
    │   └── styles.css                # Direction artistique éditoriale (Ivoire, Anthracite, Vert Olive, Terre de Garonne)
    └── js/
        ├── site-config.js            # Configuration centralisée modifiable en un seul endroit
        └── main.js                   # Menu mobile accessible, pré-remplissage contextuel et traitement réel du formulaire
```

---

## Personnalisation centralisée de l'entreprise

Toutes les informations de l'entreprise sont centralisées dans **`assets/js/site-config.js`** (ainsi que dans `site-config.json`) :

- `companyName` : Nom commercial affiché sur l'ensemble des pages.
- `contactEmail` : Adresse e-mail de réception des demandes d'évaluation.
- `formEndpointUrl` : Si vous souhaitez brancher un serveur d'envoi tiers (Formspree, Basin, webhook interne), indiquez simplement son URL ici ; à défaut, le formulaire utilise nativement le protocole `mailto:` RFC 6068 couplé à un générateur de fiche téléchargeable en `.txt` et copiable dans le presse-papiers (aucun envoi fictif simulé).
