import express from 'express';
import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
import { Transaction } from '../../classes/transaction';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> create transaction ")
        const { token, amount } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->", userData);
        if (userData.data.length != 0) {
            let resopnse = await Transaction.addTransaction(userData.data["_id"], amount, req.body.isDeposit,
                req.body.accountHolderName,  // Provide the value if needed
                req.body.accountNumber,          // Provide the value if needed
                req.body.ifscCode,                    // Provide the value if needed
                req.body.branch,                        // Provide the value if needed
                req.body.bankName,
            );
            console.log(resopnse, "--- from acion");
        }
        res.send(await Encrypt.jsonEncrypt({ "success": true }))


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
