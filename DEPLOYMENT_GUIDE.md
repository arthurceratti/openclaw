# 🚀 Guia de Deployment - Plataforma de Ensino por IA

## ✅ Verificação de Links e Tarefas

### Links Corretos
- [Repositório GitHub](https://github.com/arthurceratti/openclaw.git)
- [Documentação API](https://github.com/arthurceratti/openclaw.git/tree/main/backend/API_DOCS.md)
- [Schema do Banco de Dados](https://github.com/arthurceratti/openclaw.git/tree/main/database/init.sql)

### Status das Tarefas
- ✅ **34 de 34 tarefas concluídas**
- ✅ Todos os arquivos de documentação criados
- ✅ Arquivos faltantes para deployment adicionados

---

## 📦 Instruções de Deployment

### Opção 1: Docker (Recomendado)

#### 1. Clonar o Repositório
```bash
git clone https://github.com/arthurceratti/openclaw.git
cd openclaw
```

#### 2. Configurar Variáveis de Ambiente

**Backend:**
```bash
# backend/.env
cp backend/.env.example backend/.env
nano backend/.env

# Preencher com:
NODE_ENV=production
DATABASE_URL=postgresql://postgres:SEU_PASSWORD@localhost:5432/student_db
JWT_SECRET=SEU_JWT_SECRET_MUITO_SEGURO
JWT_EXPIRES_IN=24h
PORT=5000
```

**Frontend:**
```bash
# frontend/.env
cp frontend/.env.example frontend/.env
nano frontend/.env

# Preencher com:
VITE_API_URL=http://localhost:5000/api
NODE_ENV=production
```

#### 3. Construir Imagens Docker
```bash
# Construir backend
docker-compose -f docker-compose.yml build backend database

# Construir frontend
cd frontend
docker build -t frontend-app .
cd ..
```

#### 4. Iniciar Serviços
```bash
# Iniciar backend e banco de dados
docker-compose -f docker-compose.yml up -d backend database

# Iniciar frontend
docker run -d -p 80:80 -v $(pwd)/frontend/nginx.conf:/etc/nginx/nginx.conf:ro frontend-app

# Verificar se está rodando
docker-compose ps
```

#### 5. Acessar a Aplicação
```
http://localhost
```

---

### Opção 2: Deployment Manual (VPS/Cloud)

#### 1. Preparar o Servidor
```bash
# SSH para o servidor
ssh user@seu.servidor.com

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependências
sudo apt install -y nodejs npm postgresql nginx docker.io docker-compose
```

#### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/arthurceratti/openclaw.git
cd openclaw

# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

#### 3. Configurar PostgreSQL
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE student_db;
\q

# Importar schema
psql -d student_db -f database/init.sql
```

#### 4. Configurar Nginx
```bash
sudo nano /etc/nginx/sites-available/openclaw

# Adicionar configuração:
server {
    listen 80;
    server_name seu-domain.com;

    location / {
        root /usr/share/nginx/html/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Iniciar Backend
```bash
cd backend
node src/server.js
```

---

### Opção 3: Deployment em Servidor Compartilhado (Railway, Render, etc.)

#### 1. Railway
```bash
# Railway CLI
railway login
railway init
railway up
```

#### 2. Render
```yaml
# render.yaml
services:
  - type: web
    name: plataforma-ensino
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: node src/server.js
    envVars:
      - key: DATABASE_URL
        value: postgresql://postgres:password@host:5432/student_db
      - key: JWT_SECRET
        sync: false
```

---

## 🔐 Configuração de Banco de Dados

### PostgreSQL Local
```bash
# Iniciar PostgreSQL
sudo systemctl start postgresql

# Criar banco
sudo -u postgres psql
CREATE DATABASE student_db;
\q

# Importar schema
psql -d student_db -f database/init.sql
```

### PostgreSQL Remoto
```bash
# Configurar DATABASE_URL em backend/.env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_db
```

---

## 🧪 Testes

### Backend
```bash
cd backend
npm start
# Testar endpoint de saúde
curl http://localhost:5000/health
```

### Frontend
```bash
cd frontend
npm run dev
# Acessar http://localhost:5173
```

---

## 📊 Monitoramento

### Verificar Logs
```bash
# Backend
docker-compose logs backend

# Frontend
docker logs frontend-app

# PostgreSQL
docker-compose logs database
```

### Health Check
```bash
curl http://localhost:5000/health
```

---

## 🔄 CI/CD

### GitHub Actions (já configurado)
- PRs automatizados
- Testes automaticos
- Deploy automático ao merge em main

### Verificar Pipeline
```bash
cd .github/workflows
cat deploy.yml
```

---

## 📝 Próximos Passos

1. [ ] Configurar SSL/HTTPS (Let's Encrypt)
2. [ ] Configurar backup automático do banco de dados
3. [ ] Configurar monitoring (Prometheus + Grafana)
4. [ ] Configurar email (SMTP para emails do sistema)
5. [ ] Testar integração completa

---

## 🆘 Troubleshooting

### Problema: Backend não conecta ao banco
```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Verificar credenciais
cat backend/.env
```

### Problema: Frontend não carrega
```bash
# Limpar cache de build
rm -rf frontend/dist
npm run build

# Verificar nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Problema: CORS errors
```bash
# Verificar backend/.env
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 Documentação Adicional

- [API Documentation](backend/API_DOCS.md)
- [API V1 Endpoints](backend/API_V1.md)
- [Dockerfile Backend](backend/Dockerfile)
- [Dockerfile Frontend](frontend/Dockerfile)
- [Schema do Banco](database/init.sql)

---

## ✨ Deploy Pronto!

A aplicação está pronta para deployment. Siga as instruções acima para colocar no ar!

**Repositório:** https://github.com/arthurceratti/openclaw.git

**Status:** ✅ 34/34 tarefas concluídas
