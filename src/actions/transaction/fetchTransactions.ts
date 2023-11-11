import express from 'express';
import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch transaction ")
        const { token } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->", userData);
        if (userData.data.length != 0) {
            let mongoResponse=await MongoConnection.fetchTransaction({userId:userData.data["_id"]});
            let transactions=mongoResponse.data;
            transactions=transactions?.sort((a: any, b: any) => {
                const createTimeA = parseInt(a.createTime);
                const createTimeB = parseInt(b.createTime);
                return createTimeB - createTimeA;
            });
            console.log("------- transaction data is ",transactions);
            return res.send(await Encrypt.jsonEncrypt({ "success": true,data:transactions }))

        }
    } catch (e: any) {

        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 