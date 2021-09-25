const { 
    encryptWithPin, 
    decryptWithPin, 
} = require('cryptribo/node');

(async () => {
    try {
        const text = `Texto`;
        const pin = '123456';
        const encrypted = await encryptWithPin({body:text},pin);
        const decrypted = await decryptWithPin(encrypted, pin);
        console.log("Decrypted", decrypted);
    } catch (err) {
        console.log(err);
    }
})();