const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/1.0/identifiers/:did', async (req, res) => {
  const did = req.params.did;

  if (!did.startsWith('did:moltrust:')) {
    return res.status(400).json({
      didResolutionMetadata: { error: 'methodNotSupported' },
      didDocument: null,
      didDocumentMetadata: {},
    });
  }

  try {
    const response = await fetch(
      `https://api.moltrust.ch/identity/resolve/${encodeURIComponent(did)}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      return res.status(404).json({
        didResolutionMetadata: { error: 'notFound' },
        didDocument: null,
        didDocumentMetadata: {},
      });
    }

    const didDocument = await response.json();

    // keyAnchor lives under metadata.keyAnchor in the MolTrust API response.
    // verificationMethod[0] contains: id, type, controller, publicKeyHex only.

    return res.json({
      didDocument,
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocumentMetadata: {
        created: didDocument.metadata?.created || null,
        // Note: did:moltrust DID documents are currently immutable after
        // registration. Key rotation creates a new key entry but does not
        // change the document's created timestamp. A dedicated 'updated'
        // field will be added when mutable DID document support ships.
        updated: didDocument.metadata?.updated || didDocument.metadata?.created || null,
        keyAnchor: didDocument.metadata?.keyAnchor || null,
      },
    });
  } catch (err) {
    if (err.name === 'AbortError' || err.name === 'TimeoutError') {
      return res.status(504).json({
        didResolutionMetadata: { error: 'internalError', message: 'upstream timeout' },
        didDocument: null,
        didDocumentMetadata: {},
      });
    }
    return res.status(500).json({
      didResolutionMetadata: { error: 'internalError' },
      didDocument: null,
      didDocumentMetadata: {},
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', driver: 'did:moltrust', version: '1.0.0' });
});

app.listen(PORT, () => console.log(`did:moltrust driver running on :${PORT}`));
