import express from 'express';
import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { Configure } from "../../classes/ccAvenue"
import { Config } from '../../config/credentials';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
const router = express.Router();
const ccavenue = new Configure({
    merchant_id: Config.ccavenurCred.prod.merchant_id,
    working_key: Config.ccavenurCred.prod.working_key
})
router.get("/", async (req: any, res: any) => {
    try {
        try {
            console.log(req.body["encResp"])
            let decryptedData = ccavenue.decrypt(req.body["encResp"])
            console.log("----------------------->>> decrypted data", decryptedData)
            res.send({ "success": true, data: decryptedData });
        } catch (e: any) {
            console.log(e);
            res.send({ "success": false, error: e.toString() });
        }
    } catch (e: any) {
        console.log(e)
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router;

