"use strict";
const app = require("./configs/app.config")
const PORT = process.env.port || process.env.PORT || 4002
const dalService = require("./src/dal.service");
const CustomError = require("./src/utils/validateError");
const {FileVerifier} = require("./src/validator.service");
const { ethers } = require('ethers');

dalService.init();
app.listen(PORT, () => console.log("Server started on port:", PORT))

// async function TestVerification() {
//     try {
//         const request = {
//             data: ""
//         };
//         const { data } = request;
//         if (!data) {
//             throw new Error('Missing required parameters');
//         }
//         const decodedJsonString = ethers.toUtf8String(ethers.getBytes(data));
//         const decodedData = JSON.parse(decodedJsonString)
//         const validatorService = new FileVerifier(
//             process.env.TEMP_DIR,
//             process.env.PUBLIC_KEY_PATH
//         );
//         console.log(decodedData)
//         const result = await validatorService.verify(decodedData?.proofOfTask, decodedData?.publicIp, decodedData?.sigIpfsHash);
//         if (!result) {
//             throw new Error('Verification failed');
//         }
//         if (result.isValid) {
//             console.log("Valid")
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
// TestVerification()