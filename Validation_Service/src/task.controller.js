"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const { FileVerifier } = require("./validator.service");
const { ethers } = require('ethers');

const router = Router()

router.post("/validate", async (req, res) => {
    var data = req.body.data;
    try {
        if (!data) {
            throw new Error('Missing required parameters');
        }
        const decodedJsonString = ethers.toUtf8String(ethers.getBytes(data));
        const decodedData = JSON.parse(decodedJsonString)
        const validatorService = new FileVerifier(
            process.env.TEMP_DIR,
            process.env.PUBLIC_KEY_PATH
        );
        console.log(decodedData)
        const result = await validatorService.verify(decodedData?.proofOfTask, decodedData?.publicIp, decodedData?.sigIpfsHash);

        if(result && result.isValid){
            console.log('Vote:', result ? 'Approve' : 'Not Approved');
            return res.status(200).send(new CustomResponse(result));
        }
        else{
            return res.status(400).send(new CustomError("Invalid signature", {}));
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }
})

module.exports = router


