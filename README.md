# Portfolio — Loué Tagnon Yves (RACHID-UZOCHI)

Réalisateur · Cadreur · Monteur vidéo — Abidjan, Côte d'Ivoire.

Site multi-pages HTML / CSS / JS propulsé par **Vite**.
Dépendances : `gsap` (+ ScrollTrigger) pour les animations, `lenis` pour le défilement fluide.

## Commandes (à la racine du projet)
| Commande | Rôle |
|---|---|
| `npm install` | Installer les dépendances (après un clone) |
| `npm run dev` | Serveur de développement avec rechargement auto → http://localhost:5173 |
| `npm run build` | Version de production dans `dist/` (à mettre en ligne) |
| `npm run preview` | Tester la version de production en local |

> Ouvrir les `.html` en double-clic ne fonctionne pas : passer par `npm run dev`.

## Pages
| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : hero, à propos, outils, services 3D, réalisations en caméra 3D, méthode, témoignages, FAQ |
| `a-propos.html` | Présentation, approche créative, parcours, compétences, logiciels |
| `realisations.html` | Showreel + galerie filtrable (vidéo / photo / design) avec lecteur vidéo |
| `projet.html` | **Modèle** de fiche projet : à dupliquer par projet (ex. `projet-bloom.html`) |
| `services.html` | 6 services détaillés, méthode, formules sur devis |
| `contact.html` | Coordonnées + formulaire |

## Structure
```
PORTFOLIO NARCISSE/
├── 01_Banding/           Charte couleurs
├── 02_Moodboard/         Template de référence
├── 03_Site plan/         Plan du site
├── *.html                Les pages
├── partials/             Blocs communs insérés via <!-- @include fichier.html -->
│   ├── head.html         Polices, CSS
│   ├── sprite.html       Icônes SVG
│   ├── header.html       Menu
│   ├── process.html      Section « Ma méthode »
│   ├── cta.html          Bloc « Parlons de votre projet » + coordonnées
│   └── footer.html       Pied de page + script
├── vite.config.js        Pages auto-détectées + système d'inclusion
├── public/assets/cv/     Déposer cv-yves-narcisse-loue.pdf
└── assets/
    ├── css/style.css     Styles + couleurs (:root)
    ├── js/main.js        Animations et interactions
    └── img/              Photos / visuels
```

## Modifier le contenu
- **Visuel** : les blocs gris `class="ph"` sont des emplacements d'images.
  ```html
  <div class="ph hero__photo"><img src="./assets/img/portrait.jpg" alt="Portrait de Loué Tagnon Yves"></div>
  ```
- **Vidéo** : renseigner `data-video="https://www.youtube.com/embed/ID"` (ou lien d'intégration Vimeo) sur le showreel et les boutons ▶.
- **Nouveau projet** : copier `projet.html`, puis ajouter une carte `<article class="work" data-cat="video|photo|design">` dans `realisations.html` (et mettre à jour le compteur du filtre).
- **Formulaire** : par défaut il ouvre la messagerie du visiteur. Pour un envoi direct, créer un formulaire sur formspree.io et coller son URL dans `data-endpoint` (`contact.html`).

## À compléter (signalé dans le code par des commentaires)
- Photos, vidéos, CV PDF
- E-mail, WhatsApp, réseaux sociaux (`partials/cta.html`, `partials/footer.html`, `contact.html`, hero de `index.html`)
- Chiffres réels : années d'expérience, nombre de projets (`index.html`)
- Parcours : dates, structures, formation (`a-propos.html`)
- Témoignages clients (avec accord)
- Validation des clients et projets cités
