# ---------- Étape 1 : Build ----------
FROM node:20-alpine AS builder

# Définition du répertoire de travail
WORKDIR /app

# Augmentation de la mémoire RAM pour Node.js (6 GB)
# Ajout de flags pour stabiliser la gestion de la mémoire pendant la phase finale
ENV NODE_OPTIONS="--max-old-space-size=6144"

# Installation des dépendances
# On copie d'abord les fichiers de gestion des paquets pour optimiser le cache Docker
COPY package.json package-lock.json* ./
# --ignore-scripts is harmless here (no broken postinstall like storefrontend)
# --legacy-peer-deps works around outdated peer ranges
RUN npm install --legacy-peer-deps --ignore-scripts

# Copie de l'intégralité des sources du projet
COPY . .

# Exécution du build de production
# Note : Assurez-vous que votre angular.json est bien mis à jour avec styles: false et budgets augmentés
RUN npm run build

# ---------- Étape 2 : Runtime (Serveur Nginx) ----------
FROM nginx:alpine

# Suppression de la configuration par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie du template de configuration Nginx (pour gérer le routage SPA et le port Railway)
# Assurez-vous d'avoir un fichier nginx.conf.template à la racine de votre projet
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copie du résultat du build depuis l'étape builder
# On utilise le chemin défini dans outputPath de votre angular.json
COPY --from=builder /app/dist/ralbatech-admin /usr/share/nginx/html

# Railway injecte dynamiquement la variable PORT. Par défaut 8080 pour le local.
ENV PORT=8080
EXPOSE 8080

# Utilisation du point d'entrée par défaut d'nginx (exécute envsubst sur le template puis lance nginx)
CMD ["nginx", "-g", "daemon off;"]
