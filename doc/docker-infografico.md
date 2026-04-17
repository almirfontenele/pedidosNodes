# Infográfico do Ecossistema Docker - Pedidos Node

O diagrama abaixo ilustra como os contêineres, volumes e processos internos interagem no projeto com base na documentação criada. 
Para melhor visualização, você pode usar uma extensão no VS Code que renderize Mermaid (como "Mermaid Preview") ou utilizar visualizadores no GitHub e Notion.

```mermaid
flowchart TD
    %% Nós Externos
    User((Usuário/Dev))
    
    subgraph Orquestração["Docker Compose (docker-compose.yml)"]
        direction TB
        
        %% Serviços
        subgraph ServicoAPP["App (orders-service)"]
            direction TB
            NodeJS[Node.js 18 API]
            PortaAPI[Porta Exposta: 3000]
        end

        subgraph ServicoBD["Database (mongodb-orders)"]
            direction TB
            Mongo[MongoDB server]
            PortaBD[Porta Exposta: 27017]
        end

        %% Link Docker Compose
        ServicoAPP -->|depends_on| ServicoBD
        ServicoAPP -->|MONGO_URI| Mongo
    end

    %% Build e Runner do Dockerfile
    subgraph DockerfileBuild["O que acontece no 'build: .' (Dockerfile)"]
        direction LR
        S1["Estágio 1: Build\n(Instala dependências\n+ npm install)"]
        S2["Estágio 2: Runner\n(Node 18 Alpine Limpo)"]
        
        S1 --"Copia de\n/usr/src/app"--> S2
        S2 -->|Inicia app via\nts-node| NodeJS
    end

    %% Volume e Persistência
    Persistencia[(Volume Docker: mongo-data)]
    ServicoBD ===|/data/db| Persistencia

    %% Conexões com Usuário
    User -->|Acessa via localhost:3000| PortaAPI
    User -->|Acessa via localhost:27017| PortaBD

    classDef stage1 fill:#ffcc80,stroke:#e65100,stroke-width:2px;
    classDef stage2 fill:#a5d6a7,stroke:#1b5e20,stroke-width:2px;
    classDef mongo fill:#90caf9,stroke:#0d47a1,stroke-width:2px;
    class S1 stage1;
    class S2 stage2;
    class ServicoBD,Mongo,Persistencia mongo;
```

### 📋 Guia de Leitura do Infográfico:
1. **Orquestração (Caixa principal):** Representa o `docker-compose.yml`, que sobe a "App" e a "Database" juntas. Note a seta de `depends_on`, que mostra que o app só sobe depois que o banco inicia.
2. **Ciclo de Build (Debaixo do App):** Representa o nosso `Dockerfile` Multi-stage. Um contêiner temporário instala os pacotes (`Estágio 1`) e transfere só o necessário para a imagem limpa e leve de execução final (`Estágio 2`).
3. **Persistência de Dados:** O cilindro na parte inferior representa o volume `mongo-data`, que fica salvo no computador anfitrião para reter todas as informações geradas pelo MongoDB (em sua pasta interna `/data/db`) e não perder dados durante resets.
4. **Interação Externa:** O "Usuário" consegue se comunicar com a aplicação pelas portas abertas `3000` (API) e também inspecionar o banco em `27017`.
