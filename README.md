# did:moltrust Universal Resolver Driver

Universal Resolver driver for the `did:moltrust` DID method.

Resolves `did:moltrust` DIDs via the [MolTrust](https://moltrust.ch) registry API, returning W3C DID Documents with verification methods and service endpoints.

## Specifications

- [W3C DID Core v1.0](https://www.w3.org/TR/did-core/)
- [MolTrust Protocol TechSpec v0.8.1](https://moltrust.ch/MolTrust_Protocol_TechSpec_v0.4.pdf)

## DID Method

```
did:moltrust:<16-char-hex-id>
```

Example: `did:moltrust:d34ed796a4dc4698`

## Endpoint

```
GET /1.0/identifiers/did:moltrust:<id>
```

Proxies to: `https://api.moltrust.ch/identity/resolve/{did}`

## Response Format

```json
{
  "didDocument": {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:moltrust:d34ed796a4dc4698",
    "controller": "did:web:api.moltrust.ch",
    "metadata": {
      "display_name": "TrustScout",
      "platform": "moltrust",
      "trust_provider": "MolTrust"
    },
    "service": [
      {
        "id": "did:moltrust:d34ed796a4dc4698#payment",
        "type": "PaymentService",
        "serviceEndpoint": {
          "address": "0x3802...",
          "chain": "base",
          "currency": "USDC"
        }
      }
    ]
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  },
  "didDocumentMetadata": {
    "created": "2026-02-18T18:11:04.694323"
  }
}
```

## Run with Docker

```bash
docker build -t driver-did-moltrust .
docker run -p 8080:8080 driver-did-moltrust
```

## Test

```bash
curl http://localhost:8080/1.0/identifiers/did:moltrust:d34ed796a4dc4698
```

## Run with Node.js

```bash
npm install
npm start
```

## Universal Resolver Integration

This driver is designed for the [DIF Universal Resolver](https://github.com/decentralized-identity/universal-resolver).

Driver configuration for `docker-compose.yml`:

```yaml
driver-did-moltrust:
  image: moltrust/driver-did-moltrust:latest
  ports:
    - "8080:8080"
```

## About MolTrust

MolTrust is W3C DID/VC trust infrastructure for autonomous AI agents, built by [CryptoKRI GmbH](https://moltrust.ch) (Zurich, Switzerland).

- API: [api.moltrust.ch](https://api.moltrust.ch)
- Docs: [api.moltrust.ch/docs](https://api.moltrust.ch/docs)
- Agent Card (A2A v0.3): [api.moltrust.ch/.well-known/agent-card.json](https://api.moltrust.ch/.well-known/agent-card.json)

## License

Apache 2.0 - Copyright (c) 2026 CryptoKRI GmbH, Zurich (MolTrust)
