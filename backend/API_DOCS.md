# API Documentation - Plataforma de Ensino por IA

## Visão Geral

Esta documentação descreve a API RESTful do backend da Plataforma de Ensino por IA.

## Autenticação

### JWT Bearer Token

- **Endpoint:** Todos os endpoints protegidos
- **Header:** `Authorization: Bearer <token>`
- **Token Expiration:** 1 hora
- **Refresh:** Novo token requisitado via login

---

## Endpoints

### Autenticação

#### POST /api/auth/login
**Descrição:** Autentica usuário e retorna JWT token  
**Request:**  
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
    "id": "string",
    "email": "string",
    "name": "string"
  }
}
```

#### POST /api/auth/register
**Descrição:** Registra novo usuário  
**Request:**  
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
  "message": "Usuário registrado com sucesso"
}
```

---

### Alunos

#### GET /api/alunos
**Descrição:** Lista todos os alunos  
**Query Params:**  
- `page` (opcional, default: 1)
- `limit` (opcional, default: 10)  
**Response:**  
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "course": "string"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 10
}
```

#### GET /api/alunos/:id
**Descrição:** Busca aluno por ID  
**Response:**  
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "course": "string"
}
```

#### POST /api/alunos
**Descrição:** Cria novo aluno  
**Request:**  
```json
{
  "name": "string",
  "email": "string",
  "course": "string"
}
```  
**Response:**  
```json
{
  "id": "string",
  "message": "Aluno criado com sucesso"
}
```

#### PUT /api/alunos/:id
**Descrição:** Atualiza aluno  
**Request:**  
```json
{
  "name": "string",
  "email": "string",
  "course": "string"
}
```  
**Response:**  
```json
{
  "message": "Aluno atualizado com sucesso"
}
```

#### DELETE /api/alunos/:id
**Descrição:** Deleta aluno  
**Response:**  
```json
{
  "message": "Aluno deletado com sucesso"
}
```

---

### Cursos

#### GET /api/cursos
**Descrição:** Lista todos os cursos  
**Response:**  
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

#### GET /api/cursos/:id
**Descrição:** Busca curso por ID  
**Response:**  
```json
{
  "id": "string",
  "name": "string",
  "description": "string"
}
```

#### POST /api/cursos
**Descrição:** Cria novo curso  
**Request:**  
```json
{
  "name": "string",
  "description": "string"
}
```  
**Response:**  
```json
{
  "message": "Curso criado com sucesso"
}
```

---

### Progresso

#### GET /api/progresso/:alunoId
**Descrição:** Busca progresso de aluno  
**Response:**  
```json
{
  "alunoId": "string",
  "completedModules": [],
  "currentModule": "string",
  "completionPercentage": 0
}
```

#### POST /api/progresso/:alunoId
**Descrição:** Atualiza progresso de aluno  
**Request:**  
```json
{
  "completedModules": [],
  "currentModule": "string"
}
```  
**Response:**  
```json
{
  "message": "Progresso atualizado com sucesso"
}
```

---

## Erros

### 400 Bad Request
```json
{
  "error": "bad_request",
  "message": "Descrição do erro"
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Token inválido ou expirado"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Recurso não encontrado"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "Erro interno do servidor"
}
```

---

## Versionamento

- **Versão atual:** 1.0
- **Base URL:** https://api.plataforma.com
