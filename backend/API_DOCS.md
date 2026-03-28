# Documentação de API - Plataforma de Ensino por IA

**Versão:** 1.0.0  
**Última Atualização:** 2026-03-28  
**Autor:** KAN-33 - Documentação de API

## Visão Geral

Esta API fornece endpoints RESTful para gerenciamento de usuários, cursos, estudantes e atividades em uma plataforma de ensino por IA. A API é construída com Node.js, Express e segue princípios RESTful para operações CRUD completas.

## Características Principais

- ✅ Autenticação JWT (JSON Web Tokens)
- ✅ CRUD completo para todos os recursos
- ✅ Middleware de validação e autenticação
- ✅ Suporte a CORS
- ✅ Health check endpoint
- ✅ Respostas JSON estruturadas
- ✅ Erros padronizados

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um header `Authorization` com o token:

```
Authorization: Bearer <JWT_TOKEN>
```

### Fluxo de Autenticação

1. **Login:** POST `/auth/login` - Autenticar usuário e receber JWT
2. **Refresh:** GET `/auth/refresh` - Renovar JWT expirado
3. **Logout:** GET `/auth/logout` - Deslogar usuário e invalidar token

## Estrutura de Pastas

```
backend/
├── app.js              # Aplicação principal
├── controllers/        # Controllers de negócio
│   ├── authController.js
│   ├── userController.js
│   ├── courseController.js
│   ├── studentController.js
│   └── assignmentController.js
├── middleware/         # Middlewares (autenticação, validação, logging)
├── routes/             # Definição de rotas
│   ├── index.js
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── studentRoutes.js
│   └── assignmentRoutes.js
├── services/           # Serviços de dados
├── utils/              # Utilitários
├── src/                # Código fonte adicional
└── tests/              # Testes
```

## Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/login` | Autenticar usuário e receber JWT | Não |
| POST | `/auth/register` | Registrar novo usuário | Não |
| GET | `/auth/logout` | Deslogar usuário | Sim |
| GET | `/auth/refresh` | Renovar JWT expirado | Sim |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/users` | Listar todos os usuários | Sim |
| GET | `/users/:id` | Obter detalhes de um usuário | Sim |
| PUT | `/users/:id` | Atualizar usuário | Sim |
| DELETE | `/users/:id` | Excluir usuário | Sim |
| GET | `/users/profile` | Obter perfil do usuário atual | Sim |
| PUT | `/users/profile` | Atualizar perfil do usuário atual | Sim |
| DELETE | `/users/account` | Excluir conta do usuário atual | Sim |

### Cursos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/courses` | Listar todos os cursos | Sim |
| GET | `/courses/:id` | Obter detalhes de um curso | Sim |
| POST | `/courses` | Criar novo curso | Sim |
| PUT | `/courses/:id` | Atualizar curso | Sim |
| DELETE | `/courses/:id` | Excluir curso | Sim |
| GET | `/courses/:courseId/classes` | Listar turmas de um curso | Sim |
| GET | `/courses/:courseId/classes/:classId` | Obter detalhes de uma turma | Sim |

### Estudantes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/students` | Listar todos os estudantes | Sim |
| GET | `/students/:id` | Obter detalhes de um estudante | Sim |
| POST | `/students` | Criar novo estudante | Sim |
| PUT | `/students/:id` | Atualizar estudante | Sim |
| DELETE | `/students/:id` | Excluir estudante | Sim |
| GET | `/students/:studentId/enrollments` | Listar matrículas de um estudante | Sim |
| GET | `/students/:studentId/enrollments/:courseId` | Obter matrícula específica | Sim |
| POST | `/students/enroll` | Matricular estudante em curso | Sim |

### Atividades

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/assignments` | Listar todas as atividades | Sim |
| GET | `/assignments/:id` | Obter detalhes de uma atividade | Sim |
| POST | `/assignments` | Criar nova atividade | Sim |
| PUT | `/assignments/:id` | Atualizar atividade | Sim |
| DELETE | `/assignments/:id` | Excluir atividade | Sim |
| GET | `/assignments/:id/submissions` | Listar entregas de uma atividade | Sim |
| GET | `/assignments/:id/submissions/:submissionId` | Obter detalhes de uma entrega | Sim |
| POST | `/assignments/:id/submissions` | Entregar atividade | Sim |

## Respostas de Erro

A API retorna códigos de status HTTP padrão com mensagens claras:

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos ou parâmetros incorretos |
| 401 | Unauthorized - Token inválido ou ausente |
| 403 | Forbidden - Permissão negada |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro do servidor |

## Formato de Respostas

### Sucesso (200/201)

```json
{
  "success": true,
  "data": { /* dados do recurso */ },
  "message": "Operação realizada com sucesso"
}
```

### Erro (400/401/404/500)

```json
{
  "success": false,
  "error": "Erro específica",
  "message": "Mensagem de erro amigável",
  "code": "ERROR_CODE"
}
```

## Exemplos de Uso

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "Usuário Teste"
    }
  },
  "message": "Login realizado com sucesso"
}
```

### Criar Curso

```bash
curl -X POST http://localhost:3001/courses \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introdução à Programação",
    "description": "Curso básico de programação",
    "duration": 40
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Introdução à Programação",
    "description": "Curso básico de programação",
    "duration": 40,
    "createdAt": "2026-03-28T12:34:56.789Z"
  },
  "message": "Curso criado com sucesso"
}
```

### Criar Estudante

```bash
curl -X POST http://localhost:3001/students \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@example.com"
  }'
```

### Matricular Estudante

```bash
curl -X POST http://localhost:3001/students/enroll \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "courseId": 1
  }'
```

## Notas Técnicas

- **Port:** A API roda na porta configurada em `app.js` (padrão: 5000)
- **Base URL:** `http://localhost:3001` ou conforme ambiente
- **Timestamps:** Todos os timestamps retornados no formato ISO 8601
- **IDs:** Os IDs (`:id`, `:studentId`, `:courseId`, etc.) são numéricos
- **Headers:** Use `Content-Type: application/json` para todas as requisições
- **Paginação:** Os endpoints de listagem suportam parâmetros `?page=N&limit=M`
- **Filtragem:** Alguns endpoints suportam filtros via query parameters (ex: `?courseId=N`)

## Swagger/OpenAPI

Para documentação interativa, consulte o endpoint `/api-docs` (quando configurado) para visualização em navegador.

## Conclusão

Esta API v1 oferece endpoints RESTful completos para gerenciamento de uma plataforma de ensino por IA, incluindo autenticação JWT, usuários, cursos, estudantes, atividades e entregas. A documentação foi criada conforme KAN-33 - Documentação de API.

Para mais informações detalhadas por endpoint, consulte [API_V1.md](./API_V1.md).
