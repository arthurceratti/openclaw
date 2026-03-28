# Documentação de API - Plataforma de Ensino por IA

## Visão Geral

Esta API fornece endpoints para gerenciamento de usuários, cursos, estudantes e atividades em uma plataforma de ensino por IA.

## Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Todos os endpoints protegidos requerem um header `Authorization` com o token:

```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints de Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticar usuário e receber JWT |
| POST | `/auth/register` | Registrar novo usuário |
| GET | `/auth/logout` | Deslogar usuário |
| GET | `/auth/refresh` | Renovar JWT expirado |

## Endpoints de Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/users` | Listar todos os usuários | Necessária |
| GET | `/users/:id` | Obter detalhes de um usuário | Necessária |
| PUT | `/users/:id` | Atualizar usuário | Necessária |
| DELETE | `/users/:id` | Excluir usuário | Necessária |
| GET | `/users/profile` | Obter perfil do usuário atual | Necessária |
| PUT | `/users/profile` | Atualizar perfil do usuário atual | Necessária |
| DELETE | `/users/account` | Excluir conta do usuário atual | Necessária |

## Endpoints de Cursos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/courses` | Listar todos os cursos | Necessária |
| GET | `/courses/:id` | Obter detalhes de um curso | Necessária |
| POST | `/courses` | Criar novo curso | Necessária |
| PUT | `/courses/:id` | Atualizar curso | Necessária |
| DELETE | `/courses/:id` | Excluir curso | Necessária |
| GET | `/courses/:courseId/classes` | Listar turmas de um curso | Necessária |
| GET | `/courses/:courseId/classes/:classId` | Obter detalhes de uma turma | Necessária |

## Endpoints de Estudantes

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/students` | Listar todos os estudantes | Necessária |
| GET | `/students/:id` | Obter detalhes de um estudante | Necessária |
| POST | `/students` | Criar novo estudante | Necessária |
| PUT | `/students/:id` | Atualizar estudante | Necessária |
| DELETE | `/students/:id` | Excluir estudante | Necessária |
| GET | `/students/:studentId/enrollments` | Listar matrículas de um estudante | Necessária |
| GET | `/students/:studentId/enrollments/:courseId` | Obter matrícula específica | Necessária |
| POST | `/students/enroll` | Matricular estudante em curso | Necessária |

## Endpoints de Atividades

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/assignments` | Listar todas as atividades | Necessária |
| GET | `/assignments/:id` | Obter detalhes de uma atividade | Necessária |
| POST | `/assignments` | Criar nova atividade | Necessária |
| PUT | `/assignments/:id` | Atualizar atividade | Necessária |
| DELETE | `/assignments/:id` | Excluir atividade | Necessária |
| GET | `/assignments/:id/submissions` | Listar entregas de uma atividade | Necessária |
| GET | `/assignments/:id/submissions/:submissionId` | Obter detalhes de uma entrega | Necessária |
| POST | `/assignments/:id/submissions` | Entregar atividade | Necessária |

## Respostas de Erro

A API retorna códigos de status HTTP padrão:

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token inválido ou ausente |
| 403 | Forbidden - Permissão negada |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro do servidor |

## Exemplos de Uso

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
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
    "studentId": "1",
    "courseId": "1"
  }'
```

## Notas

- Todos os endpoints protegidos requerem autenticação via JWT
- Os IDs (`:id`, `:studentId`, `:courseId`, etc.) são numéricos
- A API é baseada em RESTful principles
- Use JSON para todas as requisições e respostas
