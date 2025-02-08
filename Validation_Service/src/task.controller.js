"use strict";
const { Router } = require("express")
const CustomError = require("./utils/validateError");
const CustomResponse = require("./utils/validateResponse");
const {FileVerifier} = require("./validator.service");

const router = Router()

router.post("/validate", async (req, res) => {
    var proofOfTask = req.body.proofOfTask;
    var data = req.body.data;
    console.log(`Validate task: proof of task: ${proofOfTask}`);
    console.log(`Validate task: data: ${data}`);
    
    try {
        return res.status(200).send(new CustomResponse(true));
        // const validatorService = new FileVerifier(process.env.TEMP_DIR, process.env.PUBLIC_KEY_PATH);
        // const result = await validatorService.verify(proofOfTask, data);
        //     if(result && result.isValid){
        //         console.log('Vote:', result ? 'Approve' : 'Not Approved');
        //         return res.status(200).send(new CustomResponse(result));
        //     }
        // else{
        //     return res.status(400).send(new CustomError("Invalid signature", {}));
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).send(new CustomError("Something went wrong", {}));
    }

})

module.exports = router