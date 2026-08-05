// Verifies the worker's token logic with real crypto, not by inspection.
// A JWT verifier that accepts a forged token is worse than no auth at all,
// so every rejection path is exercised against a genuine RSA key pair.
import { webcrypto } from 'node:crypto';
const g = globalThis;
if (!g.crypto) g.crypto = webcrypto;

// The REAL verifier from the worker, not a copy, so this suite cannot pass
// while production drifts away from it.
const { verifyIdToken } = await import('./worker.js');

const PROJECT_ID = 'my-planner-66a3e';
const results = [];
const check = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  [${detail}]` : ''}`);
};

const b64url = (bytes) => Buffer.from(bytes).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlToBytes = (s) => {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(Buffer.from(pad + '='.repeat((4 - (pad.length % 4)) % 4), 'base64'));
};

// Binds the real verifier to a test key set, so no logic is duplicated here.
function makeVerifier(keySet) {
  return (token) => verifyIdToken(token, keySet);
}

(async () => {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']);
  const pub = await crypto.subtle.exportKey('jwk', pair.publicKey);
  const attacker = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']);

  const KID = 'test-kid-1';
  const verify = makeVerifier({ [KID]: { n: pub.n, e: pub.e } });

  const now = Math.floor(Date.now() / 1000);
  const basePayload = {
    aud: PROJECT_ID,
    iss: `https://securetoken.google.com/${PROJECT_ID}`,
    sub: 'real-user-uid-123',
    name: 'Priya Sharma',
    iat: now - 60,
    exp: now + 3600,
  };

  const sign = async (payload, { kid = KID, alg = 'RS256', key = pair.privateKey } = {}) => {
    const h = b64url(Buffer.from(JSON.stringify({ alg, typ: 'JWT', kid })));
    const p = b64url(Buffer.from(JSON.stringify(payload)));
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${h}.${p}`));
    return `${h}.${p}.${b64url(sig)}`;
  };

  check('a genuine token is accepted', (await verify(await sign(basePayload)))?.uid === 'real-user-uid-123');

  const claimed = await verify(await sign({ ...basePayload, name: 'Real Name' }));
  check('the display name comes from the verified token', claimed?.name === 'Real Name');

  // The attack that matters: a token signed by somebody else's key.
  check('a token signed by a foreign key is rejected',
    (await verify(await sign(basePayload, { key: attacker.privateKey }))) === null);

  // Tampering with the payload after signing must invalidate the signature.
  const good = await sign(basePayload);
  const [gh, , gs] = good.split('.');
  const forgedPayload = b64url(Buffer.from(JSON.stringify({ ...basePayload, sub: 'someone-elses-uid' })));
  check('a tampered payload is rejected', (await verify(`${gh}.${forgedPayload}.${gs}`)) === null);

  check('the alg=none downgrade is rejected',
    (await verify(await sign(basePayload, { alg: 'none' }))) === null);

  check('an unknown key id is rejected',
    (await verify(await sign(basePayload, { kid: 'not-a-real-kid' }))) === null);

  check('an expired token is rejected',
    (await verify(await sign({ ...basePayload, exp: now - 10 }))) === null);

  check('a token for another Firebase project is rejected',
    (await verify(await sign({ ...basePayload, aud: 'some-other-project' }))) === null);

  check('a token with a wrong issuer is rejected',
    (await verify(await sign({ ...basePayload, iss: 'https://evil.example.com' }))) === null);

  check('a token issued in the future is rejected',
    (await verify(await sign({ ...basePayload, iat: now + 9999 }))) === null);

  check('a token with no subject is rejected',
    (await verify(await sign({ ...basePayload, sub: '' }))) === null);

  check('garbage input is rejected', (await verify('not.a.jwt')) === null);
  check('an empty string is rejected', (await verify('')) === null);
  check('a null token is rejected', (await verify(null)) === null);

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} token checks passed`);
  if (failed.length) process.exit(1);
})().catch((e) => { console.error('HARNESS ERROR', e); process.exit(2); });
