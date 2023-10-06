import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> sign in ")
        const { phone,
            password } = req.body

        let mongoResponse: any = await MongoConnection.findUser({
            _id: phone,
            password: stringHash(password)
        })

        if (mongoResponse.success && mongoResponse.data.length > 0) {
            let token = await TokenHandler.generateToken(mongoResponse.data[0]);
            console.log(mongoResponse.data[0], "mongo response is a",token);
            res.status(200).send(await Encrypt.jsonEncrypt({
                success: true,
                data: mongoResponse.data[0],
                token:token
            }));
        } else if (mongoResponse.success && mongoResponse.data.length == 0) {
            throw new Error("no user found");

        }
        else {
            throw new Error(mongoResponse.error)
        }

    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 