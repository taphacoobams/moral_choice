# MoralChoice

![MoralChoice Logo](./src/assets/logo.png)

MoralChoice est une Progressive Web App (PWA) interactive inspirée du court-métrage *The Village* de Mark Baker (1993). L'application propose une expérience narrative où le joueur incarne un personnage dans un village isolé et doit prendre des décisions morales face aux 7 péchés capitaux (orgueil, envie, colère, paresse, avarice, gourmandise, luxure).

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)
- [Licence](#licence)

## 🔍 Aperçu

MoralChoice est une expérience immersive de type narratif où l'utilisateur explore une carte interactive du village et fait des choix dans différents scénarios liés aux sept péchés capitaux. Chaque choix influence une jauge de réputation morale et débloque des conséquences narratives, menant à différentes fins possibles.

## ✨ Fonctionnalités

- **Authentification** : Système de connexion/inscription via Supabase Auth
- **Carte interactive** : Exploration visuelle du village avec les lieux associés aux péchés
- **Dilemmes moraux** : Scénarios narratifs avec choix multiples
- **Jauge de moralité** : Visualisation dynamique de votre score moral
- **Historique des choix** : Suivi des décisions prises
- **Fins personnalisées** : Différentes conclusions selon votre comportement
- **PWA** : Application installable sur mobile et desktop

## 🛠️ Stack technique

### Frontend
- **Framework** : React.js (Vite)
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Routing** : React Router DOM
- **Icons** : Lucide-react, Heroicons
- **State Management** : Zustand
- **Formulaires** : React Hook Form
- **Charts** : Recharts

### Backend / BaaS
- **Authentification** : Supabase Auth
- **Base de données** : Supabase PostgreSQL
- **API REST** : Supabase
- **Edge Functions** : Supabase (optionnel)

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/moral-choice.git
cd moral-choice/moral-choice-front

# Installer les dépendances
npm install

# Copier le fichier d'environnement et configurer les variables
cp .env.example .env.local

# Démarrer le serveur de développement
npm run dev
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet et configurez les variables suivantes :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuration de Supabase

1. Créez un projet sur [Supabase](https://supabase.com/)
2. Créez les tables suivantes dans votre base de données :
   - `users` : Informations du joueur
   - `scenarios` : Dilemmes moraux
   - `choices` : Historique des choix
   - `sins` : Les 7 péchés capitaux
   - `endings` : Fins possibles

## 📁 Structure du projet

```
src/
├── assets/         # Images, icônes et ressources statiques
├── components/     # Composants React réutilisables
│   ├── auth/       # Composants d'authentification
│   ├── layout/     # Composants de mise en page
│   ├── ui/         # Composants d'interface utilisateur
│   ├── village/    # Composants spécifiques au village
│   └── scenarios/  # Composants pour les scénarios
├── hooks/          # Hooks personnalisés
├── lib/            # Bibliothèques et utilitaires
│   └── supabase/   # Client et fonctions Supabase
├── pages/          # Pages principales de l'application
├── store/          # State management avec Zustand
├── App.jsx         # Composant racine avec routage
└── main.jsx        # Point d'entrée de l'application
```

## 📦 Déploiement

L'application peut être déployée sur des plateformes comme Vercel, Netlify ou Render :

```bash
# Construire pour la production
npm run build

# Prévisualiser la version de production localement
npm run preview
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Développé avec ❤️ | Inspiré par *The Village* de Mark Baker (1993)
