FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 4200

# --host 0.0.0.0: requerido para exponer el puerto fuera del contenedor
# --poll 500: habilita polling para hot-reload en Windows con Docker Desktop
CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "500"]
