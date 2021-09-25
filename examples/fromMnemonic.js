const { 
    mnemonicToRootKeyPair,
} = require('cryptribo/node');

(async () => {
    try {
        /**
         * Use this example to generate a root private and public key pair
         */
         const privateKey = await mnemonicToRootKeyPair(mnemonic);
         const publicKey = privateKey.to_public();
        console.log(secondSignedPayload);
    } catch (err) {
        console.log(err);
    }
})();