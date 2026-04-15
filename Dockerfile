# Estágio de Build
FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
# Instalamos tudo para garantir que o ts-node e o typescript estejam presentes
RUN npm install

COPY . .

# Estágio de Runner
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copiamos tudo do build (necessário para o ts-node rodar os .ts)
COPY --from=build /usr/src/app ./

# Expondo a porta da API
EXPOSE 3000

# Comando para rodar usando ts-node apontando para o seu arquivo real
# Note que usamos o executável do node_modules
CMD [ "./node_modules/.bin/ts-node", "src/index.ts" ]