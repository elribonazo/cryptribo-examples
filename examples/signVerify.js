const { 
    mnemonicToRootKeyPair, 
    signBuffer, 
    verifyBuffer,
} = require('cryptribo/node');

(async () => {
    try {
        
        const mnemonic = 'logic easily waste eager injury oval sentence wine bomb embrace gossip supreme';
        const privateKey = await mnemonicToRootKeyPair(mnemonic);
        const publicKey = privateKey.to_public();
        const userIdentity = {
            username: '@elribonazo',
            email: 'elribonazo@gmail.com'
        };
        const userIdentityBuffer = Buffer.from(JSON.stringify(userIdentity));
        const signed = await signBuffer(userIdentityBuffer, privateKey);
        const verified = await verifyBuffer(userIdentityBuffer, publicKey, signed);
        console.log("Verified", verified);

    } catch (err) {
        console.log(err);
    }
})();