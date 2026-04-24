# API JSON (v1)

Base URL atrás do proxy: `http://localhost:8080/api/v1` (ajuste host/porta conforme o `docker-compose`).

Todas as respostas de erro em JSON usam o formato `{ "error": "mensagem" }` quando aplicável.

## 1. Crédito ou débit na carteira

`POST /api/v1/users/:user_id/wallet/transactions`

**Corpo (JSON)**

```json
{
  "kind": "credit",
  "amount": "10.50"
}
```

- `kind`: `"credit"` ou `"debit"`.
- `amount`: string ou número decimal **positivo**.

**Respostas**

- `201 Created`: `{ "user_id": 1, "balance": "10.50" }`
- `422 Unprocessable Entity`: saldo insuficiente, valor inválido, etc.

**Exemplo cURL**

```bash
curl -s -X POST "http://localhost:8080/api/v1/users/1/wallet/transactions" \
  -H "Content-Type: application/json" \
  -d '{"kind":"credit","amount":"25.00"}'
```

## 2. Saldo atual da carteira

`GET /api/v1/users/:user_id/wallet/balance`

**Resposta `200`**

```json
{
  "user_id": 1,
  "balance": "125.00"
}
```

**Exemplo cURL**

```bash
curl -s "http://localhost:8080/api/v1/users/1/wallet/balance"
```

## 3. Entradas da carteira em um período

`GET /api/v1/users/:user_id/wallet/entries?from=...&to=...`

- `from` e `to` são opcionais; use data/hora em **ISO 8601** (ex.: `2026-04-24T00:00:00-03:00`).
- Filtro: `occurred_at >= from` (se `from` presente) e `occurred_at <= to` (se `to` presente).
- Ordenação: mais recentes primeiro (`occurred_at` descendente).

**Resposta `200`**

```json
{
  "user_id": 1,
  "entries": [
    {
      "id": 3,
      "kind": "debit",
      "amount": "5.00",
      "occurred_at": "2026-04-24T12:00:00Z"
    }
  ]
}
```

**Exemplo cURL**

```bash
curl -s "http://localhost:8080/api/v1/users/1/wallet/entries?from=2026-04-01T00:00:00Z&to=2026-04-30T23:59:59Z"
```
