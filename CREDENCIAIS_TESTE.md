# 🔑 Credenciais de Teste - ViaAutoPro

## Usuários Demo Criados

### 👤 Comprador
- **Email:** comprador@test.com
- **Senha:** 123456
- **Nome:** Maria Santos
- **Telefone:** (11) 91234-5678
- **WhatsApp:** 5511912345678
- **Status:** Sem assinatura (pode ver veículos mas não negociar)

### 👤 Comprador com Assinatura
- **Email:** carlos@test.com
- **Senha:** 123456
- **Nome:** Carlos Teste
- **Telefone:** (11) 99999-0000
- **Plano:** Básico (20 veículos)
- **Status:** ✅ Assinatura Ativa

### 🔧 Vendedor
- **Email:** vendedor@test.com
- **Senha:** 123456
- **Nome:** João Silva
- **Telefone:** (11) 98765-4321
- **WhatsApp:** 5511987654321
- **Veículos:** 0 cadastrados

### 🔧 Vendedor 2
- **Email:** pedro@vendedor.com
- **Senha:** 123456
- **Nome:** Pedro Vendedor
- **Telefone:** (21) 98888-7777
- **WhatsApp:** 5521988887777
- **Veículos:** 0 cadastrados

---

## 🚗 Veículos Demo (Já Aprovados)

### 1. Fiat Cronos 2020
- **Preço:** R$ 69.900,00
- **Descrição:** Sedan completo, econômico
- **Vendedor:** AutoShow Veículos
- **Contato:** (11) 98765-4321
- **Status:** ✅ Aprovado

### 2. Toyota Corolla 2018 XEi
- **Preço:** R$ 72.000,00
- **Descrição:** Seminovo, revisado
- **Vendedor:** Premium Motors
- **Contato:** (11) 91234-5678
- **Status:** ✅ Aprovado

### 3. Honda Civic 2019
- **Preço:** R$ 78.000,00
- **Descrição:** Impecável, único dono
- **Vendedor:** VIP Automóveis
- **Contato:** (11) 99999-8888
- **Status:** ✅ Aprovado

---

## 🧪 Como Testar

### Fluxo Comprador SEM Assinatura
1. Login com: `comprador@test.com` / `123456`
2. Ver catálogo (3 veículos visíveis)
3. Tentar clicar em "Negociar" → Redireciona para planos
4. Ver página de planos

### Fluxo Comprador COM Assinatura
1. Login com: `carlos@test.com` / `123456`
2. Ver banner verde "Assinatura Básico Ativa"
3. Ver catálogo com 3 veículos (limite: 20)
4. Clicar em "Negociar Agora"
5. Ver modal com dados completos do vendedor
6. Testar botões: WhatsApp, Ligar, Email

### Fluxo Vendedor
1. Login com: `vendedor@test.com` / `123456`
2. Ver página "Meus Veículos" (vazia)
3. Clicar em "+ Adicionar Veículo"
4. Preencher formulário e fazer upload de imagem
5. Cadastrar veículo (status: pendente)
6. Ver veículo na lista com badge amarelo "pendente"

### Testar Assinatura
1. Login como comprador sem assinatura
2. Clicar em "Ver Planos"
3. Escolher qualquer plano e clicar "Assinar Agora"
4. Ver alerta de sucesso (mock)
5. Voltar ao dashboard
6. Ver banner verde de assinatura ativa
7. Poder negociar agora!

---

## 🛡️ Criar Moderador

Para criar uma conta de moderador (não há interface web ainda):

```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moderador@viaautopro.com",
    "senha": "senha_forte_123",
    "nome": "Admin Moderador",
    "telefone": "(11) 00000-0000",
    "whatsapp": "5511000000000",
    "role": "moderador"
  }'
```

---

## 📊 URLs Importantes

- **App:** http://localhost:3000
- **API:** http://localhost:8001/api
- **API Docs:** http://localhost:8001/docs
- **Login:** http://localhost:3000/login
- **Planos:** http://localhost:3000/planos

---

**Última Atualização:** 03/02/2026
