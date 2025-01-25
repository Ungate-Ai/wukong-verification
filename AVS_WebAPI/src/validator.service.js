const fs = require('fs/promises');
const crypto = require('crypto');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { downloadFromLighthouse } = require('./dal.service');

class FileVerifier {
    constructor(tempDir, publicKeyPath) {
        this.tempDir = tempDir;
        this.publicKeyPath = publicKeyPath;
    }

    async verify(logCid, signature) {
        if (!logCid || !signature) {
            throw new Error('Missing required parameters');
        }

        try {
            const timestamp = Date.now();
            const tempLogPath = path.join(this.tempDir, `log_${timestamp}`);

            // Download log file
            const logDownloaded = await downloadFromLighthouse(logCid, tempLogPath);
            if (!logDownloaded) {
                throw new Error('Failed to download log file');
            }

            // Read and verify
            const content = await fs.readFile(tempLogPath);
            const publicKey = await fs.readFile(this.publicKeyPath);

            const isValid = await this.verifySignature(content, signature.trim(), publicKey);

            // Cleanup
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

module.exports = FileVerifier;

// Usage example:
/*
const verifier = new FileVerifier('./temp', './keys/public.pem');
const result = await verifier.verify('logCidHere', 'base64EncodedSignature');
console.log(result);
*/