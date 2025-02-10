const fs = require('fs/promises');
const path = require('path');
const { downloadFromLighthouse, verifySignature } = require('./dal.service');
const axios =  require("axios")
class FileVerifier {
    constructor(tempDir, publicKeyPath) {
        this.tempDir = tempDir;
        this.publicKeyPath = publicKeyPath;
    }

    async verify(logCid, signature, publicIp) {
        if (!logCid || !signature) {
            throw new Error('Missing required parameters');
        }
        try {
            const timestamp = Date.now();
            const tempLogPath = path.join(this.tempDir, `log_${timestamp}`);
            const logDownloaded = await downloadFromLighthouse(logCid, tempLogPath);
            if (!logDownloaded) {
                throw new Error('Failed to download log file');
            }

            const content = await fs.readFile(tempLogPath) //-> read from lighthouse

            const attestationResponse = await getAttestationPublicKey("13.201.207.60" || publicIp) // get the public Key from attestation API
            let publicKey= attestationResponse?.verified_attestation?.secp256k1_public
            publicKey = convertToPem(publicKey)

            publicKey = await fs.readFile(this.publicKeyPath) // using local pub key for testing

            const isValid = await verifySignature(content, signature.trim(), publicKey);
            await fs.unlink(tempLogPath).catch(console.error);
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
        'https://attestation_proxy_verifier.justfortesting.me/v1/enclave',
        JSON.stringify({
            attestation_utility_url: "http://api.deepworm.xyz/attestation/raw",
            verifier_ip: verifierUrl
        }),
        {
            headers: { 'content-type': 'application/json' }
        }
    );
      return response?.data;
  } catch (error) {
      throw error;
  }
}
function convertToPem(secp256k1PublicKey) {
    try {
      const publicKeyBuffer = Buffer.isBuffer(secp256k1PublicKey) ? secp256k1PublicKey : Buffer.from(secp256k1PublicKey, 'hex');
      const pemKey = `-----BEGIN PUBLIC KEY-----\n` +
                    publicKeyBuffer.toString('base64').replace(/(.{64})/g, '$1\n') + 
                    `\n-----END PUBLIC KEY-----`;
  
      return pemKey;
    } catch (error) {
      console.error('Error converting to PEM format:', error);
      return null;
    }
  }
module.exports = {FileVerifier};