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
//             proofOfTask: "bafkreihwmru6ce7n54nxvzu77waiwzpsh5mcabr4u75etlkjkyxeiw7vxe",
//             data: "0x7b226c6f674970667348617368223a226261666b72656968776d7275366365376e35346e78767a753737776169777a707368356d636162723475373565746c6b6a6b797865697737767865222c227369674970667348617368223a226261666b726569667763367772786c32366e6637716e673767686b7a6b73707374706f726c3565666a64657435726b6b6a64737979676971656634222c227369676e6174757265223a224d45594349514435467143412f3434534171454155734e73674434556462584c50346749676552622b4276344a35637977414968414b6845764e5a384b39485345663867717156654e623541397a743065424c70594853346e4a6f496b6c346d227d"
//         };
//         const { proofOfTask, data } = request;
//         if (!proofOfTask || !data) {
//             throw new Error('Missing required parameters');
//         }
//         const decodedJsonString = ethers.toUtf8String(ethers.getBytes(data));
//         const decodedData = JSON.parse(decodedJsonString)
//         const validatorService = new FileVerifier(
//             process.env.TEMP_DIR,
//             process.env.PUBLIC_KEY_PATH
//         );

//         const result = await validatorService.verify(proofOfTask, data,decodedData?.publicIp);
//         console.log(result)
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