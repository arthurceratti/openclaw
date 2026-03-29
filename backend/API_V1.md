# API V1 - Endpoints Detalhados

## Base URL
```
https://api.plataforma.com/v1
```

---

## Endpoints de Autenticação

### POST /auth/login
**Autentica usuário e retorna JWT token**

**Request Body:**
```json
{
  "email": "arthur@example.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "user": {
    "id": "user_123",
    "email": "arthur@example.com",
    "name": "Arthur"
  }
}
```

**Status Codes:**
- 200: Autenticação bem-sucedida
- 401: Credenciais inválidas
- 400: Request inválido

---

### POST /auth/register
**Registra novo usuário**

**Request Body:**
```json
{
  "email": "novousuario@example.com",
  "password": "secret123",
  "name": "Novo Usuário"
}
```

**Response:**
```json
{
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "user_123",
    "email": "novousuario@example.com",
    "name": "Novo Usuário"
  }
}
```

**Status Codes:**
- 201: Registro bem-sucedido
- 400: Email já cadastrado

---

## Endpoints de Alunos

### GET /alunos
**Lista todos os alunos**

**Query Parameters:**
- `page` (opcional) - Página atual (default: 1)
- `limit` (opcional) - Itens por página (default: 10, max: 100)

**Example Request:**
```
GET /alunos?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "user_123",
      "name": "Arthur",
      "email": "arthur@example.com",
      "course": "React Avançado",
      "progress": 75
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

**Status Codes:**
- 200: Lista retornada
- 401: Não autorizado

---

### GET /alunos/:id
**Busca aluno por ID**

**Example Request:**
```
GET /alunos/user_123
```

**Response:**
```json
{
  "id": "user_123",
  "name": "Arthur",
  "email": "arthur@example.com",
  "course": "React Avançado",
  "progress": 75,
  "createdAt": "2026-01-15T10:30:00Z",
  "updatedAt": "2026-03-29T14:30:00Z"
}
```

**Status Codes:**
- 200: Aluno encontrado
- 404: Aluno não encontrado

---

### POST /alunos
**Cria novo aluno**

**Request Body:**
```json
{
  "name": "Novo Aluno",
  "email": "novoaluno@example.com",
  "course": "React Avançado"
}
```

**Response:**
```json
{
  "id": "user_123",
  "name": "Novo Aluno",
  "email": "novoaluno@example.com",
  "course": "React Avançado",
  "progress": 0,
  "createdAt": "2026-03-29T14:30:00Z",
  "message": "Aluno criado com sucesso"
}
```

**Status Codes:**
- 201: Aluno criado
- 400: Email já cadastrado

---

### PUT /alunos/:id
**Atualiza aluno**

**Request Body:**
```json
{
  "name": "Novo Nome",
  "email": "novoemail@example.com",
  "course": "Curso Novo"
}
```

**Response:**
```json
{
  "id": "user_123",
  "name": "Novo Nome",
  "email": "novoemail@example.com",
  "course": "Curso Novo",
  "progress": 75,
  "updatedAt": "2026-03-29T14:30:00Z",
  "message": "Aluno atualizado com sucesso"
}
```

**Status Codes:**
- 200: Atualizado
- 404: Aluno não encontrado

---

### DELETE /alunos/:id
**Deleta aluno**

**Example Request:**
```
DELETE /alunos/user_123
```

**Response:**
```json
{
  "message": "Aluno deletado com sucesso"
}
```

**Status Codes:**
- 200: Deletado
- 404: Aluno não encontrado

---

## Endpoints de Cursos

### GET /cursos
**Lista todos os cursos**

**Response:**
```json
{
  "data": [
    {
      "id": "course_123",
      "name": "React Avançado",
      "description": "Curso de React para desenvolvedores",
      "modules": 10,
      "duration": "40 horas",
      "createdAt": "2026-01-10T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Status Codes:**
- 200: Lista retornada
- 401: Não autorizado

---

### GET /cursos/:id
**Busca curso por ID**

**Example Request:**
```
GET /cursos/course_123
```

**Response:**
```json
{
  "id": "course_123",
  "name": "React Avançado",
  "description": "Curso de React para desenvolvedores",
  "modules": [
    {
      "id": "mod_1",
      "title": "Introdução ao React",
      "duration": "2 horas",
      "completed": false
    }
  ],
  "duration": "40 horas",
  "difficulty": "Intermediário"
}
```

**Status Codes:**
- 200: Curso encontrado
- 404: Curso não encontrado

---

### POST /cursos
**Cria novo curso**

**Request Body:**
```json
{
  "name": "Novo Curso",
  "description": "Descrição do curso",
  "modules": [
    {
      "title": "Módulo 1",
      "duration": "2 horas"
    }
  ]
}
```

**Response:**
```json
{
  "id": "course_123",
  "name": "Novo Curso",
  "description": "Descrição do curso",
  "modules": 1,
  "createdAt": "2026-03-29T14:30:00Z",
  "message": "Curso criado com sucesso"
}
```

**Status Codes:**
- 201: Curso criado
- 400: Request inválido

---

## Endpoints de Progresso

### GET /progresso/:alunoId
**Busca progresso de aluno**

**Example Request:**
```
GET /progresso/user_123
```

**Response:**
```json
{
  "alunoId": "user_123",
  "alunoName": "Arthur",
  "completedModules": [
    {
      "id": "mod_1",
      "title": "Introdução ao React",
      "completedAt": "2026-03-28T10:00:00Z"
    }
  ],
  "currentModule": "Módulo 3",
  "progressPercentage": 75,
  "lastActive": "2026-03-29T12:00:00Z"
}
```

**Status Codes:**
- 200: Progresso encontrado
- 404: Aluno não encontrado
- 401: Não autorizado

---

### POST /progresso/:alunoId
**Atualiza progresso de aluno**

**Request Body:**
```json
{
  "completedModules": [
    {
      "id": "mod_3",
      "completedAt": "2026-03-29T14:30:00Z"
    }
  ],
  "currentModule": "Módulo 4"
}
```

**Response:**
```json
{
  "alunoId": "user_123",
  "completedModules": 3,
  "currentModule": "Módulo 4",
  "progressPercentage": 85,
  "message": "Progresso atualizado com sucesso"
}
```

**Status Codes:**
- 200: Progresso atualizado
- 404: Aluno não encontrado
- 401: Não autorizado

---

## Headers Comuns

### Autenticação
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Paginação (opcional)
```
X-Page: 1
X-Limit: 10
```

### Rate Limiting
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1646340000
```

---

## Timestamps

Todos os timestamps estão no formato ISO 8601:
```
2026-03-29T14:30:00Z
```

---

## Version Notes

- **v1.0:** Versão inicial com endpoints CRUD para alunos, cursos e progresso
- **Deprecation Policy:** Endpoints serão marcados como depreciados com aviso de 6 meses antes da remoção

---

## Suporte

Para dúvidas ou suporte, contate:
- **Email:** support@plataforma.com
- **Documentação:** docs.plataforma.com
