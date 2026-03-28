# API V1 - Documentação Detalhada

## Endpoint: /auth

### POST /auth/login

Autenticar usuário e receber JWT token.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string"
  }
}
```

**Status Codes:**
- 200: Sucesso
- 401: Credenciais inválidas
- 404: Usuário não encontrado

---

### POST /auth/register

Registrar novo usuário.

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string"
  }
}
```

**Status Codes:**
- 201: Usuário criado com sucesso
- 400: Email já cadastrado ou dados inválidos

---

### GET /auth/logout

Deslogar usuário e invalidar token.

**Response:**
```json
{
  "message": "Usuário deslogado com sucesso"
}
```

**Status Codes:**
- 200: Sucesso
- 401: Token inválido

---

### GET /auth/refresh

Renovar JWT token expirado.

**Response:**
```json
{
  "token": "string"
}
```

**Status Codes:**
- 200: Token renovado com sucesso
- 401: Token inválido ou expirado

---

## Endpoint: /users

### GET /users

Listar todos os usuários.

**Response:**
```json
[
  {
    "id": "number",
    "email": "string",
    "name": "string"
  }
]
```

**Status Codes:**
- 200: Lista de usuários
- 401: Não autenticado

---

### GET /users/:id

Obter detalhes de um usuário específico.

**Response:**
```json
{
  "id": "number",
  "email": "string",
  "name": "string",
  "createdAt": "string"
}
```

**Status Codes:**
- 200: Usuário encontrado
- 404: Usuário não encontrado
- 401: Não autenticado

---

### PUT /users/:id

Atualizar usuário.

**Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "email": "string",
  "name": "string"
}
```

**Status Codes:**
- 200: Usuário atualizado
- 404: Usuário não encontrado
- 400: Dados inválidos
- 401: Não autenticado

---

### DELETE /users/:id

Excluir usuário.

**Response:**
```json
{
  "message": "Usuário excluído com sucesso"
}
```

**Status Codes:**
- 200: Usuário excluído
- 404: Usuário não encontrado
- 401: Não autenticado

---

### GET /users/profile

Obter perfil do usuário atual.

**Response:**
```json
{
  "id": "number",
  "email": "string",
  "name": "string"
}
```

**Status Codes:**
- 200: Perfil encontrado
- 401: Não autenticado

---

### PUT /users/profile

Atualizar perfil do usuário atual.

**Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "email": "string",
  "name": "string"
}
```

**Status Codes:**
- 200: Perfil atualizado
- 401: Não autenticado
- 400: Dados inválidos

---

### DELETE /users/account

Excluir conta do usuário atual.

**Response:**
```json
{
  "message": "Conta excluída com sucesso"
}
```

**Status Codes:**
- 200: Conta excluída
- 401: Não autenticado

---

## Endpoint: /courses

### GET /courses

Listar todos os cursos.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "duration": "number",
    "createdAt": "string"
  }
]
```

**Status Codes:**
- 200: Lista de cursos
- 401: Não autenticado

---

### GET /courses/:id

Obter detalhes de um curso específico.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "duration": "number",
  "createdAt": "string"
}
```

**Status Codes:**
- 200: Curso encontrado
- 404: Curso não encontrado
- 401: Não autenticado

---

### POST /courses

Criar novo curso.

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "duration": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "duration": "number",
  "createdAt": "string"
}
```

**Status Codes:**
- 201: Curso criado
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /courses/:id

Atualizar curso.

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "duration": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "duration": "number"
}
```

**Status Codes:**
- 200: Curso atualizado
- 404: Curso não encontrado
- 400: Dados inválidos
- 401: Não autenticado

---

### DELETE /courses/:id

Excluir curso.

**Response:**
```json
{
  "message": "Curso excluído com sucesso"
}
```

**Status Codes:**
- 200: Curso excluído
- 404: Curso não encontrado
- 401: Não autenticado

---

### GET /courses/:courseId/classes

Listar turmas de um curso.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "courseId": "number"
  }
]
```

**Status Codes:**
- 200: Lista de turmas
- 404: Curso não encontrado
- 401: Não autenticado

---

### GET /courses/:courseId/classes/:classId

Obter detalhes de uma turma específica.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "courseId": "number"
}
```

**Status Codes:**
- 200: Turma encontrada
- 404: Turma não encontrada
- 401: Não autenticado

---

## Endpoint: /students

### GET /students

Listar todos os estudantes.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "createdAt": "string"
  }
]
```

**Status Codes:**
- 200: Lista de estudantes
- 401: Não autenticado

---

### GET /students/:id

Obter detalhes de um estudante específico.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "createdAt": "string"
}
```

**Status Codes:**
- 200: Estudante encontrado
- 404: Estudante não encontrado
- 401: Não autenticado

---

### POST /students

Criar novo estudante.

**Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "createdAt": "string"
}
```

**Status Codes:**
- 201: Estudante criado
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /students/:id

Atualizar estudante.

**Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string"
}
```

**Status Codes:**
- 200: Estudante atualizado
- 404: Estudante não encontrado
- 400: Dados inválidos
- 401: Não autenticado

---

### DELETE /students/:id

Excluir estudante.

**Response:**
```json
{
  "message": "Estudante excluído com sucesso"
}
```

**Status Codes:**
- 200: Estudante excluído
- 404: Estudante não encontrado
- 401: Não autenticado

---

### GET /students/:studentId/enrollments

Listar matrículas de um estudante.

**Response:**
```json
[
  {
    "id": "number",
    "studentId": "number",
    "courseId": "number",
    "createdAt": "string"
  }
]
```

**Status Codes:**
- 200: Lista de matrículas
- 404: Estudante não encontrado
- 401: Não autenticado

---

### GET /students/:studentId/enrollments/:courseId

Obter matrícula específica de um estudante.

**Response:**
```json
{
  "id": "number",
  "studentId": "number",
  "courseId": "number",
  "createdAt": "string"
}
```

**Status Codes:**
- 200: Matrícula encontrada
- 404: Matrícula não encontrada
- 401: Não autenticado

---

### POST /students/enroll

Matricular estudante em curso.

**Body:**
```json
{
  "studentId": "number",
  "courseId": "number"
}
```

**Response:**
```json
{
  "message": "Estudante matriculado com sucesso"
}
```

**Status Codes:**
- 200: Estudante matriculado
- 404: Estudante ou curso não encontrado
- 401: Não autenticado

---

## Endpoint: /assignments

### GET /assignments

Listar todas as atividades.

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "description": "string",
    "courseId": "number",
    "createdAt": "string"
  }
]
```

**Status Codes:**
- 200: Lista de atividades
- 401: Não autenticado

---

### GET /assignments/:id

Obter detalhes de uma atividade específica.

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "courseId": "number",
  "createdAt": "string"
}
```

**Status Codes:**
- 200: Atividade encontrada
- 404: Atividade não encontrada
- 401: Não autenticado

---

### POST /assignments

Criar nova atividade.

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "courseId": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "courseId": "number",
  "createdAt": "string"
}
```

**Status Codes:**
- 201: Atividade criada
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /assignments/:id

Atualizar atividade.

**Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "courseId": "number"
}
```

**Status Codes:**
- 200: Atividade atualizada
- 404: Atividade não encontrada
- 400: Dados inválidos
- 401: Não autenticado

---

### DELETE /assignments/:id

Excluir atividade.

**Response:**
```json
{
  "message": "Atividade excluída com sucesso"
}
```

**Status Codes:**
- 200: Atividade excluída
- 404: Atividade não encontrada
- 401: Não autenticado

---

### GET /assignments/:id/submissions

Listar entregas de uma atividade.

**Response:**
```json
[
  {
    "id": "number",
    "assignmentId": "number",
    "studentId": "number",
    "content": "string",
    "submittedAt": "string"
  }
]
```

**Status Codes:**
- 200: Lista de entregas
- 404: Atividade não encontrada
- 401: Não autenticado

---

### GET /assignments/:id/submissions/:submissionId

Obter detalhes de uma entrega específica.

**Response:**
```json
{
  "id": "number",
  "assignmentId": "number",
  "studentId": "number",
  "content": "string",
  "submittedAt": "string"
}
```

**Status Codes:**
- 200: Entrega encontrada
- 404: Entrega não encontrada
- 401: Não autenticado

---

### POST /assignments/:id/submissions

Entregar atividade.

**Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "assignmentId": "number",
  "studentId": "number",
  "content": "string",
  "submittedAt": "string"
}
```

**Status Codes:**
- 201: Entrega realizada
- 404: Atividade não encontrada
- 400: Dados inválidos
- 401: Não autenticado

---

## Informações Adicionais

### Base URL

```
http://localhost:3001
```

### Headers Comuns

| Header | Valor | Obrigatório |
|--------|-------|-------------|
| Content-Type | application/json | Sim |
| Authorization | Bearer <TOKEN> | Apenas endpoints protegidos |

### Timestamp Format

Todos os timestamps retornados no formato ISO 8601:

```
"2026-03-28T12:34:56.789Z"
```

### Paginação

Os endpoints de listagem suportam parâmetros de paginação:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| limit | number | Limite de itens por página (padrão: 10) |
| page | number | Página desejada (padrão: 1) |

**Exemplo:**
```
GET /courses?page=2&limit=5
```

### Filtragem

Alguns endpoints suportam filtros via query parameters:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| courseId | number | Filtrar por ID do curso |

**Exemplo:**
```
GET /students?courseId=1
```

---

## Conclusão

Esta API v1 oferece endpoints RESTful para gerenciamento completo de uma plataforma de ensino por IA, incluindo autenticação, usuários, cursos, estudantes, atividades e entregas.

Para mais informações, consulte a documentação principal em [API_DOCS.md](./API_DOCS.md).
