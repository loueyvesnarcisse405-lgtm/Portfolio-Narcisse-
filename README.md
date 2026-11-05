# Site — Portfolio Yves-Narcisse Loué

Site multi-pages HTML / CSS / JS propulsé par **Vite**.
Dépendances : `gsap` (+ ScrollTrigger) pour les animations, `lenis` pour le défilement fluide.

## Commandes (à la racine du projet)
| Commande | Rôle |
|---|---|
| `npm install` | Installer les dépendances (après un clone) |
| `npm run dev` | Serveur de développement avec rechargement auto → http://localhost:5173 |
| `npm run build` | Version de production dans `dist/` (à mettre en ligne) |
| `npm run preview` | Tester la version de production en local |

> Ouvrir `index.html` en double-clic ne fonctionne plus : passer par `npm run dev`.

## Structure
```
PORTFOLIO NARCISSE/
├── 01_Banding/           Charte couleurs
├── 02_Moodboard/         Template de référence
├── 03_Site plan/         Plan du site
├── index.html            Accueil (fait)
├── a-propos.html         À faire
├── realisations.html     À faire
├── services.html         À faire
├── contact.html          À faire
├── vite.config.js        Tout .html à la racine devient une page du build
├── public/assets/cv/     Déposer cv-yves-narcisse-loue.pdf (copié tel quel)
└── assets/
    ├── css/style.css     Styles + tokens couleurs (:root)
    ├── js/main.js        Animations et interactions
    └── img/              Photos / visuels (optimisés au build)
```

## Remplacer un visuel
Les blocs gris marqués `class="ph"` sont des emplacements d'images :
```html
<div class="ph hero__photo"><img src="./assets/img/portrait.jpg" alt="Portrait d'Yves-Narcisse Loué"></div>
```
Le libellé du placeholder disparaît automatiquement.

## À compléter (signalé dans le code par des commentaires)
- Photos (portrait, tournage, projets), CV PDF
- Liens réseaux sociaux, e-mail, téléphone / WhatsApp
- Chiffres réels : années d'expérience, nombre de projets
- Témoignages clients (avec accord)
- Validation des clients cités (logos / projets)
