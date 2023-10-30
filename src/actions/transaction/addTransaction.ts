import express from 'express';
import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> create transaction ")
        const { token, amount } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->", userData);
        if (userData.data.length != 0) {
            let mongoResponse: any = await MongoConnection.addTransaction({
                userId: userData.data["_id"],
                _id: makeid(6),
                amount: amount,
                createTime: new Date().getTime()
            })
            console.log(mongoResponse, "--->> resposne data from create ticket ")
        }

        return res.send(await Encrypt.jsonEncrypt({ "success": true }))


    } catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router;

function makeId(arg0: number) {
    throw new Error('Function not implemented.');
}
