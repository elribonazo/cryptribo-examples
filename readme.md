# CryptRibo - The all in one package for Cardano development with some extra cool features

The package source code is built on typescript but bundled for browsers and nodejs with the corresponding wasm cardano files from @emurgo. While still fixing and making improvements the source-code will not be published and is not yet fully ready for production environments.

## Instructions

How can I install the package?

```bash
npm i cryptribo --save
# or
yarn add cryptribo
```

After that, you will be able to import the cjs or esm module as usual in your code with

```javascript
const cryptribo = require("cryptribo");
or;
import cryptribo from "cryptribo";
```

## I'm ready, so now... what?

### Getting private and public key-pair using bip39 mnemonics

```javascript
const { mnemonicToRootKeyPair } = require("cryptribo/node");
(async () => {
  try {
    const privateKey = await mnemonicToRootKeyPair(mnemonic);
    const publicKey = privateKey.to_public();
    console.log(secondSignedPayload);
  } catch (err) {
    console.log(err);
  }
})();
```

### Encrypt and Decrypt anything with password

```javascript
const { encryptWithPin, decryptWithPin } = require("cryptribo/node");
(async () => {
  try {
    const text = `Texto`;
    const pin = "123456";
    const encrypted = await encryptWithPin({ body: text }, pin);
    const decrypted = await decryptWithPin(encrypted, pin);
    console.log("Decrypted", decrypted);
  } catch (err) {
    console.log(err);
  }
})();
```

### CBOR JSON WEB TOKEN

```javascript
const {
  mnemonicToRootKeyPair,
  issueJWTCborToken,
  verifyJWTCborToken,
} = require("cryptribo/node");
(async () => {
  try {
    const mnemonic =
      "logic easily waste eager injury oval sentence wine bomb embrace gossip supreme";
    const privateKey = await mnemonicToRootKeyPair(mnemonic);
    const publicKey = privateKey.to_public();
    const jwt = await issueJWTCborToken(userIdentity, privateKey);
    const verifiedCredentials = await verifyJWTCborToken(jwt, publicKey);
    console.log("Credentials", verifiedCredentials);
  } catch (err) {
    console.log(err);
  }
})();
```

### Sign and verify

```javascript
const {
  mnemonicToRootKeyPair,
  signBuffer,
  verifyBuffer,
} = require("cryptribo/node");
(async () => {
  try {
    const mnemonic =
      "logic easily waste eager injury oval sentence wine bomb embrace gossip supreme";
    const privateKey = await mnemonicToRootKeyPair(mnemonic);
    const publicKey = privateKey.to_public();
    const userIdentity = {
      username: "@elribonazo",
      email: "elribonazo@gmail.com",
    };
    const userIdentityBuffer = Buffer.from(JSON.stringify(userIdentity));
    const signed = await signBuffer(userIdentityBuffer, privateKey);
    const verified = await verifyBuffer(userIdentityBuffer, publicKey, signed);
    console.log("Verified", verified);
  } catch (err) {
    console.log(err);
  }
})();
```

## No bears, no whales, just BUIDLers

**Whats coming next?**
A end-2-end secure communication channels for browser tabs using Cardano primitives, custom signed handshakes. Gonna make your brain explode
