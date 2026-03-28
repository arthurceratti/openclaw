# API V1 - Documentação Detalhada por Endpoint

**Versão:** 1.0.0  
**Última Atualização:** 2026-03-28  
**Base URL:** `http://localhost:3001`

---

## Endpoint: /auth

Autenticação e gerenciamento de sessões JWT.

### POST /auth/login

Autenticar usuário e receber JWT token.

**Request:**
- **Method:** POST
- **Content-Type:** application/json
- **Path:** `/auth/login`

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string"
    }
  },
  "message": "Login realizado com sucesso"
}
```

**Status Codes:**
- 200: Sucesso
- 401: Credenciais inválidas
- 404: Usuário não encontrado

---

### POST /auth/register

Registrar novo usuário.

**Request:**
- **Method:** POST
- **Content-Type:** application/json
- **Path:** `/auth/register`

**Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": "number",
      "email": "string",
      "name": "string"
    }
  },
  "message": "Usuário registrado com sucesso"
}
```

**Status Codes:**
- 201: Usuário criado com sucesso
- 400: Email já cadastrado ou dados inválidos
- 409: Email duplicado

---

### GET /auth/logout

Deslogar usuário e invalidar token.

**Request:**
- **Method:** GET
- **Path:** `/auth/logout`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Usuário deslogado com sucesso"
}
```

**Status Codes:**
- 200: Sucesso
- 401: Token inválido

---

### GET /auth/refresh

Renovar JWT token expirado.

**Request:**
- **Method:** GET
- **Path:** `/auth/refresh`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "string"
  },
  "message": "Token renovado com sucesso"
}
```

**Status Codes:**
- 200: Token renovado com sucesso
- 401: Token inválido ou expirado

---

## Endpoint: /users

Gerenciamento de usuários.

### GET /users

Listar todos os usuários.

**Request:**
- **Method:** GET
- **Path:** `/users`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "email": "string",
      "name": "string",
      "createdAt": "string"
    }
  ],
  "message": "Lista de usuários retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de usuários
- 401: Não autenticado
- 403: Permissão negada

---

### GET /users/:id

Obter detalhes de um usuário específico.

**Request:**
- **Method:** GET
- **Path:** `/users/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "email": "string",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Usuário encontrado"
}
```

**Status Codes:**
- 200: Usuário encontrado
- 404: Usuário não encontrado
- 401: Não autenticado

---

### PUT /users/:id

Atualizar usuário.

**Request:**
- **Method:** PUT
- **Path:** `/users/:id`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "email": "string",
    "name": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Usuário atualizado com sucesso"
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

**Request:**
- **Method:** DELETE
- **Path:** `/users/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
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

**Request:**
- **Method:** GET
- **Path:** `/users/profile`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "message": "Perfil do usuário encontrado"
}
```

**Status Codes:**
- 200: Perfil encontrado
- 401: Não autenticado

---

### PUT /users/profile

Atualizar perfil do usuário atual.

**Request:**
- **Method:** PUT
- **Path:** `/users/profile`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "message": "Perfil atualizado com sucesso"
}
```

**Status Codes:**
- 200: Perfil atualizado
- 401: Não autenticado
- 400: Dados inválidos

---

### DELETE /users/account

Excluir conta do usuário atual.

**Request:**
- **Method:** DELETE
- **Path:** `/users/account`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Conta excluída com sucesso"
}
```

**Status Codes:**
- 200: Conta excluída
- 401: Não autenticado

---

## Endpoint: /courses

Gerenciamento de cursos.

### GET /courses

Listar todos os cursos.

**Request:**
- **Method:** GET
- **Path:** `/courses`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "duration": "number",
      "createdAt": "string"
    }
  ],
  "message": "Lista de cursos retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de cursos
- 401: Não autenticado

---

### GET /courses/:id

Obter detalhes de um curso específico.

**Request:**
- **Method:** GET
- **Path:** `/courses/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "duration": "number",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Curso encontrado"
}
```

**Status Codes:**
- 200: Curso encontrado
- 404: Curso não encontrado
- 401: Não autenticado

---

### POST /courses

Criar novo curso.

**Request:**
- **Method:** POST
- **Path:** `/courses`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "duration": "number"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "duration": "number",
    "createdAt": "string"
  },
  "message": "Curso criado com sucesso"
}
```

**Status Codes:**
- 201: Curso criado
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /courses/:id

Atualizar curso.

**Request:**
- **Method:** PUT
- **Path:** `/courses/:id`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string",
  "description": "string",
  "duration": "number"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "duration": "number",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Curso atualizado com sucesso"
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

**Request:**
- **Method:** DELETE
- **Path:** `/courses/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
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

**Request:**
- **Method:** GET
- **Path:** `/courses/:courseId/classes`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "courseId": "number",
      "createdAt": "string"
    }
  ],
  "message": "Lista de turmas retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de turmas
- 404: Curso não encontrado
- 401: Não autenticado

---

### GET /courses/:courseId/classes/:classId

Obter detalhes de uma turma específica.

**Request:**
- **Method:** GET
- **Path:** `/courses/:courseId/classes/:classId`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "courseId": "number",
    "createdAt": "string"
  },
  "message": "Turma encontrada"
}
```

**Status Codes:**
- 200: Turma encontrada
- 404: Turma não encontrada
- 401: Não autenticado

---

## Endpoint: /students

Gerenciamento de estudantes e matrículas.

### GET /students

Listar todos os estudantes.

**Request:**
- **Method:** GET
- **Path:** `/students`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10&courseId=N` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "createdAt": "string"
    }
  ],
  "message": "Lista de estudantes retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de estudantes
- 401: Não autenticado

---

### GET /students/:id

Obter detalhes de um estudante específico.

**Request:**
- **Method:** GET
- **Path:** `/students/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Estudante encontrado"
}
```

**Status Codes:**
- 200: Estudante encontrado
- 404: Estudante não encontrado
- 401: Não autenticado

---

### POST /students

Criar novo estudante.

**Request:**
- **Method:** POST
- **Path:** `/students`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "createdAt": "string"
  },
  "message": "Estudante criado com sucesso"
}
```

**Status Codes:**
- 201: Estudante criado
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /students/:id

Atualizar estudante.

**Request:**
- **Method:** PUT
- **Path:** `/students/:id`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "name": "string",
  "email": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Estudante atualizado com sucesso"
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

**Request:**
- **Method:** DELETE
- **Path:** `/students/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
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

**Request:**
- **Method:** GET
- **Path:** `/students/:studentId/enrollments`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "studentId": "number",
      "courseId": "number",
      "createdAt": "string"
    }
  ],
  "message": "Lista de matrículas retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de matrículas
- 404: Estudante não encontrado
- 401: Não autenticado

---

### GET /students/:studentId/enrollments/:courseId

Obter matrícula específica de um estudante.

**Request:**
- **Method:** GET
- **Path:** `/students/:studentId/enrollments/:courseId`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "studentId": "number",
    "courseId": "number",
    "createdAt": "string"
  },
  "message": "Matrícula encontrada"
}
```

**Status Codes:**
- 200: Matrícula encontrada
- 404: Matrícula não encontrada
- 401: Não autenticado

---

### POST /students/enroll

Matricular estudante em curso.

**Request:**
- **Method:** POST
- **Path:** `/students/enroll`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "studentId": "number",
  "courseId": "number"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Estudante matriculado com sucesso"
}
```

**Status Codes:**
- 200: Estudante matriculado
- 404: Estudante ou curso não encontrado
- 401: Não autenticado

---

## Endpoint: /assignments

Gerenciamento de atividades e entregas.

### GET /assignments

Listar todas as atividades.

**Request:**
- **Method:** GET
- **Path:** `/assignments`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "courseId": "number",
      "createdAt": "string"
    }
  ],
  "message": "Lista de atividades retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de atividades
- 401: Não autenticado

---

### GET /assignments/:id

Obter detalhes de uma atividade específica.

**Request:**
- **Method:** GET
- **Path:** `/assignments/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "courseId": "number",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Atividade encontrada"
}
```

**Status Codes:**
- 200: Atividade encontrada
- 404: Atividade não encontrada
- 401: Não autenticado

---

### POST /assignments

Criar nova atividade.

**Request:**
- **Method:** POST
- **Path:** `/assignments`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "title": "string",
  "description": "string",
  "courseId": "number"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "courseId": "number",
    "createdAt": "string"
  },
  "message": "Atividade criada com sucesso"
}
```

**Status Codes:**
- 201: Atividade criada
- 400: Dados inválidos
- 401: Não autenticado

---

### PUT /assignments/:id

Atualizar atividade.

**Request:**
- **Method:** PUT
- **Path:** `/assignments/:id`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "title": "string",
    "description": "string",
    "courseId": "number",
    "createdAt": "string",
    "updatedAt": "string"
  },
  "message": "Atividade atualizada com sucesso"
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

**Request:**
- **Method:** DELETE
- **Path:** `/assignments/:id`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
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

**Request:**
- **Method:** GET
- **Path:** `/assignments/:id/submissions`
- **Header:** Authorization: Bearer <TOKEN>
- **Query:** `?page=1&limit=10` (opcional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "assignmentId": "number",
      "studentId": "number",
      "content": "string",
      "submittedAt": "string"
    }
  ],
  "message": "Lista de entregas retornada",
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number"
  }
}
```

**Status Codes:**
- 200: Lista de entregas
- 404: Atividade não encontrada
- 401: Não autenticado

---

### GET /assignments/:id/submissions/:submissionId

Obter detalhes de uma entrega específica.

**Request:**
- **Method:** GET
- **Path:** `/assignments/:id/submissions/:submissionId`
- **Header:** Authorization: Bearer <TOKEN>

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "assignmentId": "number",
    "studentId": "number",
    "content": "string",
    "submittedAt": "string"
  },
  "message": "Entrega encontrada"
}
```

**Status Codes:**
- 200: Entrega encontrada
- 404: Entrega não encontrada
- 401: Não autenticado

---

### POST /assignments/:id/submissions

Entregar atividade.

**Request:**
- **Method:** POST
- **Path:** `/assignments/:id/submissions`
- **Header:** Authorization: Bearer <TOKEN>
- **Content-Type:** application/json

**Body:**
```json
{
  "content": "string"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "number",
    "assignmentId": "number",
    "studentId": "number",
    "content": "string",
    "submittedAt": "string"
  },
  "message": "Entrega realizada com sucesso"
}
```

**Status Codes:**
- 201: Entrega realizada
- 404: Atividade não encontrada
- 400: Dados inválidos
- 401: Não autenticado

---

## Headers Comuns

| Header | Valor | Obrigatório |
|--------|-------|-------------|
| Content-Type | application/json | Sim (para POST/PUT/PATCH) |
| Authorization | Bearer <TOKEN> | Apenas endpoints protegidos |

## Timestamp Format

Todos os timestamps retornados no formato ISO 8601:

```
"2026-03-28T12:34:56.789Z"
```

## Paginação

Os endpoints de listagem suportam parâmetros de paginação:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| page | number | Página desejada (padrão: 1) |
| limit | number | Limite de itens por página (padrão: 10) |

**Exemplo:**
```
GET /courses?page=2&limit=5
```

## Filtragem

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

Esta API v1 oferece endpoints RESTful completos para gerenciamento de uma plataforma de ensino por IA, incluindo autenticação JWT, usuários, cursos, estudantes, atividades e entregas.

**Documentação criada conforme:** KAN-33 - Documentação de API

Para mais informações, consulte [API_DOCS.md](./API_DOCS.md).
