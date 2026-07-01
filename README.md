# 💰 Controle de Despesas API

API RESTful desenvolvida em **Node.js** para gerenciamento de despesas pessoais, contando com autenticação segura via **JWT**, criptografia de senhas com **Bcrypt** e geração de relatórios estatísticos (Dashboard) diretamente do banco de dados **MySQL**.

Projeto desenvolvido para a disciplina de **Desenvolvimento Back-End**.

---

# 🛠️ Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript.
- **Express** — Framework para criação da API REST.
- **Sequelize ORM** — Modelagem dos dados e integração com o banco MySQL.
- **MySQL** — Banco de dados relacional.
- **JWT (JSON Web Token)** — Autenticação e proteção das rotas.
- **Bcrypt** — Criptografia das senhas dos usuários.
- **Dotenv** — Gerenciamento das variáveis de ambiente.

---

# ⚙️ Configuração do Ambiente

## 1. Clonar o projeto

```bash
git clone <url-do-repositorio>
cd nome-do-projeto
```

---

## 2. Instalar as dependências

```bash
npm install
```

---

## 3. Configurar o arquivo `.gitignore`

Para evitar que arquivos locais e informações sensíveis sejam enviados ao GitHub, utilize o seguinte conteúdo:

```gitignore
node_modules/
.env
npm-debug.log*
.vscode/
.DS_Store
Thumbs.db
```

---

## 4. Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado **.env** contendo:

```env
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASS=sua_senha_mysql
DB_NAME=nome_do_seu_banco

JWT_SECRET=chave_secreta_para_estudo_senac

PORT=3000
```

---

# ▶️ Executando o Projeto

Após configurar o banco de dados e o arquivo `.env`, execute:

```bash
node src/app.js
```

Na inicialização da aplicação, os **Seeders** são executados automaticamente para:

- Popular a tabela de categorias;
- Criar um usuário administrador padrão.

### Usuário administrador

**E-mail**

```text
admin@senac.com
```

**Senha**

```text
123
```

---

# 🔐 Autenticação

A API utiliza autenticação baseada em **JWT (JSON Web Token)**.

Após realizar o login, será retornado um token semelhante a:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Todas as rotas protegidas devem receber esse token no cabeçalho da requisição:

```text
Authorization: Bearer SEU_TOKEN
```

---

# 🧪 Fluxo de Testes (Postman)

A Collection do Postman foi organizada para validar todas as regras de negócio da API na sequência correta.

---

## 1️⃣ Cadastro de Usuário

**POST**

```http
POST http://localhost:3000/users
```

### Objetivo

Cadastrar um novo usuário.

Caso o e-mail informado já exista, será retornado:

- **400 Bad Request**

Informando que o e-mail já está em uso.

---

## 2️⃣ Login

**POST**

```http
POST http://localhost:3000/auth/login
```

### Objetivo

Validar as credenciais utilizando **Bcrypt**.

Em caso de sucesso, retorna um **JWT** que será utilizado nas demais rotas protegidas.

---

## 3️⃣ Listar Categorias

**GET**

```http
GET http://localhost:3000/categories
```

### Objetivo

Listar todas as categorias cadastradas automaticamente pelos Seeders.

Exemplos:

- Alimentação
- Transporte
- Saúde
- Educação
- Lazer

Os IDs retornados serão utilizados no cadastro das despesas.

---

## 4️⃣ Criar Despesas

**POST**

```http
POST http://localhost:3000/expenses
```

### Requisito

Enviar o Token JWT:

```text
Authorization: Bearer SEU_TOKEN
```

### Objetivo

Cadastrar despesas vinculadas automaticamente ao usuário autenticado.

---

## 5️⃣ Listar Despesas com Filtros

**GET**

```http
GET http://localhost:3000/expenses?status=PENDENTE
```

### Objetivo

Validar os Query Parameters da API.

Exemplo:

```text
?status=PENDENTE
```

A rota retorna apenas despesas que atendem ao filtro informado.

---

## 6️⃣ Dashboard

As rotas do Dashboard executam consultas agregadas diretamente no banco de dados utilizando funções SQL como:

- `SUM`
- `COUNT`
- `GROUP BY`

Todas exigem autenticação via JWT.

### Total gasto

```http
GET http://localhost:3000/dashboard/total-expenses
```

Retorna o valor total das despesas cadastradas pelo usuário.

---

### Quantidade de despesas

```http
GET http://localhost:3000/dashboard/expenses-count
```

Retorna o número total de despesas registradas.

---

### Gastos por categoria

```http
GET http://localhost:3000/dashboard/expenses-by-category
```

Retorna os valores agrupados por categoria.

---

# 📁 Estrutura Geral da API

```text
src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── repositories/
├── routes/
├── seeders/
├── services/
├── utils/
└── app.js
```

---

# 📌 Principais Funcionalidades

- Cadastro de usuários
- Login com autenticação JWT
- Senhas criptografadas com Bcrypt
- CRUD de despesas
- Categorias pré-cadastradas
- Filtros utilizando Query Params
- Relatórios estatísticos
- Dashboard com consultas SQL agregadas
- Proteção de rotas por Token
- Integração com MySQL utilizando Sequelize

---

# 👨‍💻 Autor

Projeto desenvolvido como atividade da disciplina de **Desenvolvimento Back-End**, utilizando **Node.js**, **Express**, **Sequelize**, **MySQL**, **JWT** e **Bcrypt** para implementação de uma API REST completa para gerenciamento de despesas pessoais.