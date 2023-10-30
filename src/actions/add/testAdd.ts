
import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
import fs from 'fs/promises';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> test add ")
        console.log(req.body);
        res.send({
            success:true
        })
       
    } catch (e: any) {
        console.log(e)
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 