# Documentação da Configuração do Docker (Pedidos Node)

Neste projeto, o Docker é utilizado para criar um ambiente isolado, replicável e pronto para uso tanto para a API construída em Node.js quanto para o banco de dados MongoDB. O gerenciamento dessa infraestrutura é responsabilidade de dois arquivos principais: o **`Dockerfile`** e o **`docker-compose.yml`**.

Abaixo detalhamos o passo a passo do funcionamento arquitetural do ecossistema do Docker neste projeto.
**Dockerfile**
```
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
```



**docker-compose.yml**
```
version: '3.8'

services:
  app:
    build: .
    container_name: orders-service
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://database:27017/ordersdb
    depends_on:
      - database

  database:
    image: mongo:latest
    container_name: mongodb-orders
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```



---

## 1. Construção da Imagem da Aplicação (`Dockerfile`)

O `Dockerfile` da aplicação utiliza uma técnica de **Multi-stage Build** (construção em múltiplas etapas), que visa otimizar, organizar e diminuir o tamanho da imagem final do contêiner.

### Estágio 1: Build (Construção)
O objetivo desta etapa é apenas instalar todas as dependências e preparar o ambiente de arquivos.

* `FROM node:18-alpine AS build`: Inicia a construção com base em uma imagem oficial do Node.js versão 18. O sufixo `alpine` indica que é uma versão de sistema operacional minimalista ultra leve. Essa etapa recebe o apelido/nome de `build`.
* `WORKDIR /usr/src/app`: Define o diretório de trabalho padrão dentro do contêiner virtual, onde todas as operações seguintes irão ocorrer.
* `COPY package*.json ./`: Copia apenas os rastreadores de dependências para o contêiner (`package.json` e `package-lock.json`). Fazer isto separadamente melhora absurdamente o sistema de cache do Docker nas próximas atualizações.
* `RUN npm install`: Instala as dependências, garantindo que as ferramentas vitais (como `typescript` e `ts-node`) estejam presentes.
* `COPY . .`: Copia o resto de código fonte da nossa máquina para dentro do contêiner.

### Estágio 2: Runner (Execução)
Nesta etapa, focamos exclusivamente em preparar a imagem de produção para rodar, limpa de sobras de processos antigos do OS.

* `FROM node:18-alpine AS runner`: Inicia uma imagem limpa (do zero) baseada no `node:18-alpine`.
* `ENV NODE_ENV=production`: Define as variáveis de ambiente, indicando ao sistema que se trata de uma imersão de produção (otimizando a performance do framework).
* `COPY --from=build /usr/src/app ./`: **O passo mais importante do Muti-stage:** Copia seletivamente todo o cache do primeiro estágio (`build`) de uma vez só para essa nova imagem limpa.
* `EXPOSE 3000`: Expõe à rede interna a porta 3000 de dentro do contêiner, alertando o Docker que ele está apto a trafegar requisições nesta porta.
* `CMD [ "./node_modules/.bin/ts-node", "src/index.ts" ]`: É o executor nativo do contêiner. Ele não irá executar um build JavaScript, e sim usará a ferramenta `ts-node` alocada nos módulos locais (`node_modules`) para compilar e iniciar em realtime o `src/index.ts`.

---

## 2. Orquestração dos Serviços (`docker-compose.yml`)

Para evitar rodar comandos de terminal de forma individual interligando contêineres e configurações extensas, usamos o Docker Compose, que conecta o Banco de Dados e a Aplicação simulando uma rede em comum.

O processo levanta dois serviços paralelos:

### Serviço: Banco de Dados (`database`)
Responsável pelas propriedades do MongoDB.
* **Imagem**: `image: mongo:latest` puxa diretamente do Docker Hub a versão mais madura oficial do Mongo.
* **Nome e Portas**: Estabelece que ele se chamará `mongodb-orders` e interliga a porta nativa do Mongo no contêiner (`27017`) com a mesa porta `27017` do localhost da máquina que roda a aplicação.
* **Volumes de Persistência**: Ao definir `volumes: mongo-data:/data/db`, garantimos que todos os pedidos transacionados não se percam caso reiniciemos a máquina ou esse contêiner MongoDB seja fechado/destruído. Os dados são salvos em nosso HD externamente nas camadas do Docker.

### Serviço: API (`app`)
A nossa aplicação Node.js local.
* **Construção**: A tag `build: .` define que este contêiner não fará download de lugares externos; sua imagem será criada na hora processando os passos do nosso `Dockerfile`.
* **Identificação Visual**: Mapeado como `orders-service`, liga nossa porta local `3000` à porta `3000` do contêiner.
* **Comunicação Segura de Ambiente**: A variável `MONGO_URI=mongodb://database:27017/ordersdb` aponta sua rota. Nós usamos `database` ao invés de definir erro apontando ao `localhost` porque eles conversam entre si usando a topologia mapeada no compose.
* **Dependência Atrelada**: A propriedade `depends_on: - database` obriga a arquitetura a inicializar o projeto backend apenas **após** ter garantia de que o banco de dados já inicializou. Reduz as mortes do boot (`crash looping`).

---

## 3. Guia de Execução Simplificado

Para transformar tudo o que foi descrito em código num ambiente ativo, basta apenas alocar seu prompt no local contendo o script do compose e compilar/subir a grade de orquestração:

```bash
docker-compose up -d --build
```

**Resultado esperado:**
1. A rede de comunicação será criada.
2. O sistema baixará/criará as imagens necessárias.
3. O volume será preparado para não apagar dados já existentes.
4. O `database` (Mongo) irá subir.
5. O `app` (Node.js) iniciará executando seu ambiente via TypeScript consumindo esse banco em tempo real.
6. Acesso integral garantido via `http://localhost:3000`.
