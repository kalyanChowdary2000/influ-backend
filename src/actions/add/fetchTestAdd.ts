import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch testAdd ")
        const {
        } = req.body
        let mongoResponse: any = await MongoConnection.fetchTestAdd({ active: true });
        console.log(mongoResponse, "youtube data from db")
        mongoResponse.data.sort((a: any, b: any) => {
            // Compare the "createdTime" field as strings
            return b.createdTime - a.createdTime
        });
        console.log(mongoResponse, "youtube data from db")
        if (mongoResponse.success) {
            res.send({
                success: true,
                data: mongoResponse.data
        });
        }
        else {
            res.send(await Encrypt.jsonEncrypt({
                success: false,
            }));
        }
    }

    catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 