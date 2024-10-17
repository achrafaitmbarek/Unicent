# Utilisez une image Node.js officielle comme base
FROM node:18

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install --legacy-peer-deps
# Install TypeScript and React type definitions
RUN npm install --save-dev typescript @types/react @types/react-dom --force

# Copiez les fichiers du projet dans le conteneur
COPY . .

# Construisez l'application Next.js
RUN npm run build

# Exposez les ports pour Next.js et Prisma Studio
EXPOSE 3000 5555

# Créez un script pour démarrer l'application et Prisma Studio
# Créez un script pour démarrer l'application et Prisma Studio
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'npx prisma db push' >> /app/start.sh && \
    echo 'npx prisma studio --host 0.0.0.0 --port 5555 & npm run dev' >> /app/start.sh && \
    chmod +x /app/start.sh

# Utilisez le script start.sh pour démarrer l'application
CMD ["/bin/sh", "/app/start.sh"]