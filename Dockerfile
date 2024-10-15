# Utilisez une image Node.js officielle comme base
FROM node:18

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez les fichiers du projet dans le conteneur
COPY . .

# Construisez l'application Next.js
RUN npm run build

# Exposez le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]