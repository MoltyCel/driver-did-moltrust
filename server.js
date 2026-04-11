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
      `https://api.moltrust.ch/identity/resolve/${encodeURIComponent(did)}`
    );

    if (!response.ok) {
      return res.status(404).json({
        didResolutionMetadata: { error: 'notFound' },
        didDocument: null,
        didDocumentMetadata: {},
      });
    }

    const didDocument = await response.json();

    return res.json({
      didDocument,
      didResolutionMetadata: {
        contentType: 'application/did+ld+json',
      },
      didDocumentMetadata: {
        created: didDocument.metadata?.created || null,
        updated: didDocument.metadata?.created || null,
      },
    });
  } catch (err) {
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
