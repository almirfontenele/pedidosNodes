# --- Estágio 1: Build & Dependencies ---
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências primeiro (otimiza cache de camadas)
COPY package*.json ./

# Instala apenas as dependências necessárias, evitando scripts maliciosos e limpando cache
RUN npm ci --only=production && npm cache clean --force

# Copia o resto do código
COPY . .

# --- Estágio 2: Produção ---
FROM node:18-alpine AS runner

# Define variável de ambiente para produção
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copia apenas o que é estritamente necessário do estágio de build
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app ./ 

# Segurança: Muda o dono da pasta para o usuário não-root 'node'
RUN chown -R node:node /usr/src/app

# Switch para o usuário sem privilégios
USER node

# Porta da API
EXPOSE 3000

# Execução direta do node (evita o npm como PID 1 para lidar melhor com sinais do SO)
CMD [ "node", "index.js" ]