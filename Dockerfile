# Estágio de build (para TypeScript, se necessário no futuro)
FROM node:18-alpine

# Diretório da aplicação
WORKDIR /usr/src/app

# Instalação de dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte
COPY . .

# Porta da API
EXPOSE 3000

# Inicialização
CMD [ "npm", "start" ]
