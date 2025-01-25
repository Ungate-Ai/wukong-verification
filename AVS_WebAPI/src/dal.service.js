const fs = require('fs/promises');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function downloadFromLighthouse(cid, targetPath) {
    try {
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch from Lighthouse');
        }
        
        const buffer = await response.buffer();
        await fs.writeFile(targetPath, buffer);
        return true;
    } catch (error) {
        console.error('Download error:', error);
        return false;
    }
}


async function verifySignature(content, signature, publicKey) {
    try {
        const verify = crypto.createVerify('SHA256');
        verify.update(content);
        const decodedSignature = Buffer.from(signature, 'base64');
        return verify.verify(publicKey, decodedSignature);
    } catch (error) {
        console.error('Verification error:', error);
        return false;
    }
}

module.exports = {
  downloadFromLighthouse,
  verifySignature
}