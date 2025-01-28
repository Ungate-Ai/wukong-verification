const fs = require('fs/promises');
const crypto = require('crypto');
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
      
      // Make sure signature is properly decoded from base64
      const decodedSignature = Buffer.from(signature, 'base64');
      
      return verify.verify(publicKey, decodedSignature);
  } catch (error) {
      console.error('Verification error:', error);
      console.error('Content length:', content.length);
      console.error('Signature:', signature);
      return false;
  }
}

module.exports = {
  downloadFromLighthouse,
  verifySignature
}