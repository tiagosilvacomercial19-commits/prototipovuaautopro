# 🚗 ViaAutoPro - Portal de Veículos

## 📖 Sobre o Projeto

**ViaAutoPro** é um portal completo de compra e venda de veículos com sistema de assinatura para compradores e gerenciamento de anúncios para vendedores.

### ✨ Funcionalidades Principais

#### 👥 **Sistema de Usuários**

**🔧 VENDEDOR:**
- Cadastra veículos (aguardam aprovação do moderador)
- Visualiza APENAS seus próprios veículos
- NÃO tem acesso ao catálogo geral
- Recebe contato de compradores interessados

**🛒 COMPRADOR (COM assinatura ativa):**
- Acessa catálogo completo de veículos
- Visualiza preços, fotos e descrições
- Vê dados completos do vendedor (nome, telefone, WhatsApp, email)
- Pode negociar diretamente

**🛒 COMPRADOR (SEM assinatura ou vencida):**
- Visualiza veículos e preços (modo teaser)
- NÃO vê dados do vendedor
- NÃO pode negociar
- Recebe incentivo para assinar

**👨‍💼 MODERADOR:**
- Aprova ou rejeita veículos de vendedores
- Gerencia qualidade do catálogo

---

## 💎 Planos de Assinatura

| Plano | Preço | Veículos | Extras |
|-------|-------|----------|--------|
| **💎 Básico** | R$ 379,90/mês | Até 20 veículos | - |
| **🏆 Premium** | R$ 699,90/mês | Até 40 veículos | - |
| **👑 VIP** | R$ 1.099,00/mês | TODOS os veículos | Negociador presencial |

**Pagamento:** Mock (simulado) - Pronto para integração com Mercado Pago/PIX

---

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** (Python) - API REST
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Motor** - Driver assíncrono MongoDB

### Frontend
- **React 19** - Interface
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Axios** - Requisições HTTP

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- MongoDB rodando

### Backend
```bash
cd /app/backend
pip install -r requirements.txt
# Rodar via supervisor (já configurado)
sudo supervisorctl restart backend
```

### Frontend
```bash
cd /app/frontend
yarn install
# Rodar via supervisor (já configurado)
sudo supervisorctl restart frontend
```

### Acessar
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **Docs API:** http://localhost:8001/docs

---

## 📡 Principais Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Veículos
- `GET /api/veiculos` - Listar veículos (comprador)
- `GET /api/veiculos/meus` - Meus veículos (vendedor)
- `POST /api/veiculos` - Cadastrar veículo (vendedor)
- `GET /api/veiculos/{id}/detalhes` - Detalhes completos (requer assinatura)
- `PATCH /api/veiculos/{id}/aprovar` - Aprovar (moderador)
- `PATCH /api/veiculos/{id}/rejeitar` - Rejeitar (moderador)

### Planos e Assinaturas
- `GET /api/planos` - Listar planos disponíveis
- `POST /api/assinatura/criar` - Criar assinatura (mock)
- `GET /api/assinatura/minha` - Status da minha assinatura

---

## 🔐 Variáveis de Ambiente

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=*
JWT_SECRET=viaautopro-secret-key-2025
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://seu-dominio.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## 🧪 Testando o Sistema

### 1. Criar Vendedor
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendedor@test.com",
    "senha": "123456",
    "nome": "João Silva",
    "telefone": "(11) 98765-4321",
    "whatsapp": "5511987654321",
    "role": "vendedor"
  }'
```

### 2. Criar Comprador
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "comprador@test.com",
    "senha": "123456",
    "nome": "Maria Santos",
    "telefone": "(11) 91234-5678",
    "whatsapp": "5511912345678",
    "role": "comprador"
  }'
```

### 3. Testar Login
Acesse: http://localhost:3000/login

---

## 📋 Dados Demo

O sistema inicializa com:
- ✅ 3 planos de assinatura
- ✅ 3 veículos demo (já aprovados)

---

## 🔮 Próximos Passos (Roadmap)

### Pagamento Real
- [ ] Integração Mercado Pago
- [ ] Integração PIX
- [ ] Webhooks de confirmação

### Painel Moderador
- [ ] Interface web para moderação
- [ ] Dashboard com métricas
- [ ] Histórico de aprovações/rejeições

### Melhorias
- [ ] Busca e filtros de veículos
- [ ] Upload de múltiplas imagens
- [ ] Chat interno vendedor-comprador
- [ ] Sistema de favoritos
- [ ] Notificações por email
- [ ] Edição/exclusão de veículos

---

## 📞 Suporte

Para dúvidas ou problemas:
- Documentação da API: http://localhost:8001/docs
- Instruções para Moderador: `/app/MODERADOR_INSTRUCOES.md`

---

## 📄 Licença

Projeto desenvolvido para ViaAutoPro © 2026

**Status:** ✅ MVP Completo e Funcional
