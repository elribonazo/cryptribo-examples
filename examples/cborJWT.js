const { 
    mnemonicToRootKeyPair, 
    issueJWTCborToken,
    verifyJWTCborToken
} = require('cryptribo/node');

(async () => {
    try {
        const mnemonic = 'logic easily waste eager injury oval sentence wine bomb embrace gossip supreme';

         const privateKey = await mnemonicToRootKeyPair(mnemonic);
         const publicKey = privateKey.to_public();

        const jwt = await issueJWTCborToken(userIdentity, privateKey);
        const verifiedCredentials = await verifyJWTCborToken(jwt, publicKey);
        console.log("Credentials", verifiedCredentials);

    } catch (err) {
        console.log(err);
    }
})();