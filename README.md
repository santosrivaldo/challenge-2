# Challenge 2

The idea with this test is to allow us to better comprehend the skills of candidates to developer jobs, in various experience levels.

This test should be completed by you on your own, in your own time. Take as much time as you need, but usually this test shouldn't take more than a couple of hours to be done.

## Delivery instructions

Download the instructions this repo and, once done, put all project files in a .zip file or a git repository and send it to your contact at Forlav.

## Project description

Your job is create an application to manage users and their respective virtual wallets.

Each user has one virtual wallet. Each virtual wallet has multiple entries for credits and debits.

Throu the web interface, you will need to:

- List users;
- Add a new user;
- Edit an existing user;
- Show the user's details including his virtual wallet current balance;
- Credit or debit money to the user's virtual wallet;
- List the user's virtual wallet entries ordered by date and time.

You will also need to create three API endpoints to:

- Credit or debit money to the user's virtual wallet;
- Retrieve an user's virtual wallet current balance;
- Retrieve an user's virtual wallet entries in a period of time.

Your application MUST:

- Be written in Ruby 2.4 or greater;
- Be written in Rails 5.2 or greater;
- Use a relational database such as PostgreSQL, MySQL or SQLite;
- Accept and return JSON in the API endpoints;
- Be simple to configure and execute, running on a Unix-compatible environment (Linux or macOS).

Your application doesn't need to:

- Deal with authentication or authorization (bonus points if it does, though, specially via oAuth);
- Use Docker (bonus points if it does);
- Be pretty.

## Review

Your project will be evaluated by the following criteria:

- Does the application fulfill the basic requirements?
- Did you document how to configure and run the application?
- Did you provide API documentation?
- Did you follow closely the project specification?
- Quality of the code itself, how it's strutured and how it complies with good object-oriented practices
- Quality and coverage of unit / funcional / automated tests
- Familiarity with the standard libraries of the language and other packages

---

## Implementação (WalletApp)

Aplicação Rails 7 + PostgreSQL, MVC com serviços para operações na carteira, testes Minitest e empacotamento com **Docker Compose** (app, banco e **Nginx** na entrada).

### Requisitos

- Ruby **>= 3.1** e Bundler (execução local), ou apenas **Docker Desktop** (Linux containers).
- PostgreSQL acessível nas portas configuradas em desenvolvimento.

### Documentação da API

Consulte [docs/API.md](docs/API.md) para os três endpoints JSON com exemplos `curl`.

### Executar com Docker Compose

1. Na raiz do projeto: `docker compose up --build` (credenciais de desenvolvimento já estão definidas em [docker-compose.yml](docker-compose.yml); **altere-as antes de qualquer ambiente exposto à Internet**).
2. A interface web e a API ficam atrás do proxy em **http://localhost:8080**.
3. Migrações e `db:prepare` são executadas pelo entrypoint do serviço `web` após o Postgres ficar saudável.

Para personalizar variáveis, copie [.env.example](.env.example) para `.env`, ajuste os valores e use `docker compose --env-file .env up --build` (requer alinhar substituições no `docker-compose.yml` ou duplicar as chaves em `environment:`).

Para popular dados de exemplo: `docker compose exec web bundle exec rails db:seed`.

Se o build da imagem `web` (ou `ci`) falhar em `apt-get` (código 100), volte a construir com log plano para ver `Failed to fetch`, DNS ou timeout:

```bash
docker compose build --progress=plain web
```

Em seguida verifique rede/VPN, DNS do Docker Desktop ou proxy `HTTP_PROXY`/`HTTPS_PROXY` no ambiente de build.

O projeto inclui [Gemfile.lock](Gemfile.lock) no repositório; o `bundle install` na imagem continua a precisar de alcançar **rubygems.org** (ou um espelho). Se aparecer `Could not reach host index.rubygems.org` ou erro de DNS no passo do Bundler:

1. O [docker-compose.yml](docker-compose.yml) define `build.extra_hosts` para `rubygems.org`, `index.rubygems.org` e `api.rubygems.org` com um endereço IPv4 da rede Fastly (predefinido `151.101.129.227`), para contornar falhas de DNS do daemon. Pode sobrepor com `RUBYGEMS_IPV4` no ambiente ou no `.env` (ver [.env.example](.env.example)); atualize o IP com `nslookup rubygems.org 8.8.8.8` se o build falhar por TLS ou conexão.
2. O Dockerfile tenta ainda gravar `nameserver 8.8.8.8` em `/etc/resolv.conf` antes do Bundler (ignorado se o ficheiro for só de leitura).
3. No Docker Desktop, defina DNS público nas definições do daemon ou corrija firewall/VPN.
4. Opcional: use um espelho Rubygems via variável de ambiente (o Compose repassa-a como build-arg):

```powershell
$env:RUBYGEMS_MIRROR="https://URL-DO-ESPELHO"
docker compose build web
```

(O URL deve ser o que a tua equipa ou o fornecedor do espelho indica para substituir `https://rubygems.org` no Bundler.)

Use `docker compose build` (e não só `docker build` na pasta `docker`) para aplicar os `extra_hosts` do Compose.

O Dockerfile define `BUNDLE_RETRY` e `BUNDLE_TIMEOUT` e instala `libyaml-dev` para compilações nativas (por exemplo `psych`).

### CI/CD no Docker Compose

Serviços adicionais (perfis Compose) para encaixar num pipeline sem alterar o arranque normal (`docker compose up` continua a subir apenas `db`, `web` e `proxy`).

| Serviço | Perfil | Função |
|---------|--------|--------|
| `ci` | `ci` | Imagem [docker/ci/Dockerfile](docker/ci/Dockerfile), espera o Postgres, corre `db:test:prepare` e a suíte Minitest contra `wallet_app_test`. A base de testes é criada no primeiro arranque do volume via [docker/db/init/01-wallet_test.sql](docker/db/init/01-wallet_test.sql). |
| `cd` | `cd` | Reutiliza a imagem `walletapp-web`, executa `bundle exec rails db:migrate` na base de produção (passo de “deploy” de esquema após build). |

Exemplos:

```bash
docker compose --profile ci run --rm ci
docker compose --profile cd run --rm cd
```

Se o volume `pgdata` já existia antes deste script de init, apague o volume ou crie manualmente a base `wallet_app_test` para o serviço `ci`.

### Executar localmente (sem Docker)

1. Crie bases `wallet_app_development` e `wallet_app_test` no PostgreSQL.
2. `bundle install`
3. `bin/rails db:prepare`
4. `bin/rails server` e aceda a http://localhost:3000

Variáveis úteis: `DB_HOST`, `DB_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` (ver [config/database.yml](config/database.yml)).

### Frontend (React)

Interface SaaS de carteira virtual em [frontend/](frontend/) (Vite, React 18, TypeScript, Tailwind). Lista utilizadores, criação, detalhe com crédito/débito, transações com filtro por datas e toasts.

```bash
cd frontend
npm install
npm run dev
```

O servidor de desenvolvimento Vite usa por omissão a **porta 5173** (http://localhost:5173).

Por omissão os dados vêm de um **mock em memória** em `frontend/src/mocks/wallet.ts`. Para apontar à API Rails real, defina `VITE_API_BASE_URL` (por exemplo `http://localhost:8080/api/v1`) e substitua o conteúdo desse módulo por `fetch`, mantendo os mesmos tipos e assinaturas exportadas.

Se o browser bloquear pedidos por CORS, configure `server.proxy` em [frontend/vite.config.ts](frontend/vite.config.ts) para o host do Rails ou habilite CORS na aplicação Rails.

### Testes

```bash
RAILS_ENV=test bin/rails db:test:prepare
bin/rails test
```

### Estrutura relevante

- Modelos: `User`, `Wallet`, `WalletEntry`
- Serviço: `Wallets::CreditDebitService` (transação com `lock` na carteira)
- API: `app/controllers/api/v1/users/wallets_controller.rb`
- Interface web Rails: `UsersController` e vistas em `app/views/users`
- Interface React (mock): pasta `frontend/` (rotas em `frontend/src/routes.tsx`, mock em `frontend/src/mocks/wallet.ts`)
