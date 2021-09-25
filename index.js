const { 
    verifyBuffer,
    expose,
} = require('cryptribo/node');
const cbor = require('cbor');
const crypto = require('crypto');

(async () => {
    try {
        const wasm = await expose();

        async function generateSignedPayloadWithPassword(payload, password, publicSignature) {
            const userPasswordBuffer = Buffer.from(crypto.createHash("sha256").update(password + "Random text").digest('hex'));
            const browserPrivKey = wasm.PrivateKey.from_extended_bytes(userPasswordBuffer);
            const browserPubKey = browserPrivKey.to_public();
            const bundledPayload = publicSignature ? 
                {...payload, challenge: cbor.encode(browserPubKey.as_bytes()).toString('hex')} 
                : payload;
            const randomPinSignature = browserPrivKey.sign(Buffer.from(JSON.stringify(bundledPayload)));
            console.log("Signed payload ", bundledPayload);
            return {
                publicKey: browserPubKey,
                signature: randomPinSignature,
                payload: bundledPayload
            };
        }

        async function verifyPostMessage(communication, challenge) {
            const pubKey = wasm.PublicKey.from_bytes(cbor.decode(challenge));
            const verify = await verifyBuffer(Buffer.from(JSON.stringify(communication.payload)), pubKey,wasm.Ed25519Signature.from_hex(communication.signature));
            if (!verify) {
                throw new Error("Signature is not valid.");
            }
            if (communication.exp > 99999999) {
                throw new Error("Signature is valid but has expired.")
            }
            return pubKey;
        }

        ///First browser communication
        // Service wants to mint a resource in GC Wallet
        // The service generates a random pin and asks the user to enter a password
        // The user generates a PrivateKey based on the sha256 hash of his password
        // The user then signs the random pin and the payload
        // the browser then adds the invisible iframe and opens

        const randomPin = '12345675432122';
        const userPassword = '123456';
        const UNVERIFIED = {
            type: 'UNVERIFIED',
            challenge: randomPin
        };
        const VERIFIED = {
            type: 'VERIFIED'
        };
        

        const unverifiedPayload = {
            ...UNVERIFIED,
            pin: randomPin,
            issuer: randomPin,
            exp: 500000,
        };

        const {
            signature,
            publicKey
        } = await generateSignedPayloadWithPassword(unverifiedPayload, userPassword);
        
        const communitation = {
            signature: signature.to_hex(), 
            payload: unverifiedPayload
        };

        const browserChallenge = cbor.encode(publicKey.as_bytes()).toString('hex');
        // The invisible browser loaded with wallet on the iframe listens for messages from the opener origin.
        // Gets the challenge in the url and listens for messages, remains unsigned (listen status)
        // GETS a communication message with a payload that can be read or not, with the public key in the url.
        // If the message originated in the same code from the store where private key existed, okey, if not its lost, gc 
        // can reject it
        const verified = await verifyPostMessage(communitation, browserChallenge);
        // After this verified true, we know
        // The person that opened the window tab sent a public key in the url
        // Inside the communication there was a pin
        // We now create a verified payload, which includes the initial pin and a new generated pin
        // We then generate a signed verified payload that has the issuer pin as password, passing last
        // Attribute as true, which will include the publicKey in the payload
        const randomPin2 = '23023082989823';
        const verifiedPayload = {
            ...VERIFIED,
            consumer: randomPin,
            issuer: randomPin2,
            exp: 500000,
        }

        // The wallet loader from iframe must store in localstorage
        // A cookie is saved which contains GC_${transactionId} => encryptwithPW issuer:pkey:consumerPin [Cookie only valid in Wallets Domain + time perior]
        const secondSignedPayload = await generateSignedPayloadWithPassword(verifiedPayload, randomPin, true);
        //The iframe is ready to send the verified communication back to the customer
        const signedCommunication = {
            signature: secondSignedPayload.signature.to_hex(),
            payload: secondSignedPayload.payload
        }

        // The original client is then ready to create the popup with the wallet and has a secure channel
        // Check the origin is correct
        // Check the consumer is the same randomIp that was generated
        if (signedCommunication.payload.consumer !== randomPin) {
            throw new Error("I'm not the consumer of this payload, ignoring.");
        }

        //Okey, Now the browser gets a verified message from a chrome extension or tab
        //Checks for origin
        //Checks if that both pins in communication payload are correct
        
        const secondBrowserChallenge = cbor.encode(secondSignedPayload.publicKey.as_bytes()).toString('hex');
        const verifySignedCommunication = await verifyPostMessage(signedCommunication, secondBrowserChallenge);
        
        //From now on the first browser will have a way to send multiple signed payloads that contain both consumerIds
        //From now on the broser tab (wallet) can be opened without sending any sensitive transaction data in url
        //The first browser, creates a signed transaction and sends it to B.
        //The browser (wallet) gets the communication back. If the cookie is still valid, it can check if the communication originated 
        //in the same issuer + use the cookie's public to verify the message came correctly from the issuer.

        console.log(secondSignedPayload);
        



    } catch (err) {
        console.log(err);
    }
})();