# 🛡️ Instruções para Moderador - ViaAutoPro

## Credenciais de Acesso

O moderador tem acesso especial para aprovar ou rejeitar veículos cadastrados pelos vendedores.

### Como Criar Conta de Moderador

Execute o seguinte comando no terminal do servidor:

```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "moderador@viaautopro.com",
    "senha": "senha_segura_aqui",
    "nome": "Moderador ViaAutoPro",
    "telefone": "(11) 00000-0000",
    "whatsapp": "5511000000000",
    "role": "moderador"
  }'
```

**IMPORTANTE:** Altere a senha para algo seguro!

---

## Endpoints da API para Moderação

### 1. **Aprovar Veículo**

```bash
curl -X PATCH http://localhost:8001/api/veiculos/{VEHICLE_ID}/aprovar \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 2. **Rejeitar Veículo**

```bash
curl -X PATCH http://localhost:8001/api/veiculos/{VEHICLE_ID}/rejeitar \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. **Listar Todos os Veículos (incluindo pendentes)**

Para ver veículos pendentes de aprovação, consulte diretamente o MongoDB:

```bash
# Acessar MongoDB
mongosh mongodb://localhost:27017/test_database

# Listar veículos pendentes
db.vehicles.find({"status": "pendente"})

# Ver todos os status
db.vehicles.aggregate([
  {$group: {_id: "$status", count: {$sum: 1}}}
])
```

---

## Fluxo de Moderação

1. **Vendedor cadastra veículo** → Status: `pendente`
2. **Moderador analisa** → Decide aprovar ou rejeitar
3. **Aprovado** → Status: `aprovado` → Aparece no catálogo para compradores
4. **Rejeitado** → Status: `rejeitado` → Vendedor vê mas não aparece no catálogo

---

## Integração Futura (Painel Admin)

Para facilitar a moderação, você pode criar uma interface web onde o moderador:

- Vê lista de veículos pendentes
- Visualiza fotos e detalhes
- Aprova/rejeita com um clique
- Vê histórico de ações

**Endpoint sugerido:** `/admin/dashboard` (a ser implementado)

---

## Contato Técnico

Para suporte técnico ou dúvidas sobre o sistema, contate o desenvolvedor.

**Sistema:** ViaAutoPro v1.0
**Data:** Fevereiro 2026
