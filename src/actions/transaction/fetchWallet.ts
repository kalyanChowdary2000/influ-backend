import express from 'express';

import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch wallet ")
        const { token} = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->", userData);
        if (userData.data.length != 0) {
                let mongoResponse: any = await MongoConnection.findUser({
                    _id:userData.data._id
                })
                console.log(mongoResponse, "--->> resposne data from fetch wallet ")
                if (mongoResponse.success && mongoResponse.data.length > 0) {
                   await TokenHandler.updateToken(token,mongoResponse.data[0]);
                    console.log(mongoResponse.data[0], "mongo response is a",token);
                    res.status(200).send(await Encrypt.jsonEncrypt({
                        success: true,
                        data: mongoResponse.data[0],
                    }));
                } else if (mongoResponse.success && mongoResponse.data.length == 0) {
                    throw new Error("no user found");
        
                }
            }
    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 