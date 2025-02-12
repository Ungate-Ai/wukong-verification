const fs = require('fs/promises');
const path = require('path');
const { downloadFromLighthouse, verifySignature } = require('./dal.service');
const axios = require("axios")
const asn1 = require('asn1.js');
const Buffer = require('buffer').Buffer;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const ECPublicKey = asn1.define('ECPublicKey', function() {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('curve').objid()
    ),
    this.key('publicKey').bitstr()
  );
});

class FileVerifier {
    constructor(tempDir, publicKeyPath) {
        this.tempDir = tempDir;
        this.publicKeyPath = publicKeyPath;
    }

    async verify(logCid, publicIp, sigIpfsHash) {
        if (!logCid || !publicIp || !sigIpfsHash) {
            throw new Error('Missing required parameters');
        }
        let publicKey
        try {
            const timestamp = Date.now();
            const tempLogPath = path.join(this.tempDir, `log_${timestamp}`);
            const logDownloaded = await downloadFromLighthouse(logCid, tempLogPath);

            const tempSigLogPath = path.join(this.tempDir, `log_${timestamp}_sig.sig`);
            const logSigDownloaded = await downloadFromLighthouse(sigIpfsHash, tempSigLogPath);

            if (!logDownloaded || !logSigDownloaded) {
                throw new Error('Failed to download log file');
            }
            const sigContent = await fs.readFile(tempSigLogPath) //-> read from lighthouse
            const content = await fs.readFile(tempLogPath) //-> read from lighthouse

            const attestationResponse = await getAttestationPublicKey(publicIp) // get the public Key from attestation API
            
            const publicKey = "04" + `${attestationResponse}`;
            const pubKey = ec.keyFromPublic(publicKey, 'hex')
            const isValid = await verifySignature(content, sigContent, pubKey);
            await fs.unlink(tempLogPath).catch(console.error)
            return {
                success: true,
                isValid,
                logCid,
                verifiedAt: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Verification failed: ${error.message}`);
        }
    }
}


async function getAttestationPublicKey(publicIp) {
    try {
        const verifierUrl = `http://${publicIp}:1400`;
        console.log(verifierUrl)
        const response = await axios.post(
            "https://attestation_proxy_verifier.justfortesting.me/v1/enclave",
            {
                attestation_utility_url: "http://api.deepworm.xyz/attestation/raw",
                verifier_ip: `${verifierUrl}`
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*'
                }
            }
        );
        return response?.data?.parsed_attestation?.public_key;
    } catch (error) {
        console.log("Attestation URL Issue")
        throw error;
    }
}


function convertToPEM(pubKeyHex) {
    const ECDSA_OID = [1, 2, 840, 10045, 2, 1];
    const SECP256K1_OID = [1, 3, 132, 0, 10];
    
    pubKeyHex = pubKeyHex.replace('0x', '');
    const pubKeyBuffer = Buffer.from(pubKeyHex, 'hex');
    
    const derBuffer = ECPublicKey.encode({
      algorithm: {
        id: ECDSA_OID,
        curve: SECP256K1_OID
      },
      publicKey: { 
        data: pubKeyBuffer
      }
    }, 'der');
    
    const base64 = derBuffer.toString('base64');
    const pem = ['-----BEGIN PUBLIC KEY-----', ...base64.match(/.{1,64}/g), '-----END PUBLIC KEY-----'].join('\n');
    
    return pem;
  }
module.exports = { FileVerifier, getAttestationPublicKey };