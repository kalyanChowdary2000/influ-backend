import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> payment verifications")
        const { token } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->",userData);
        if (userData.data.length != 0) {
            //console.log(stringHash(req.body.password));
            let response: any = await MongoConnection.findUser({
                _id: userData.data._id,
            });
            console.log(response.data[0].active,"from mongo")
            console.log("******************************************************");
            console.log("******************************************************");
            if (response.data[0].active) {
                console.log("******************************************************");
                console.log("******************************************************");
                //  await TokenHandler.updateToken(req.body.token, response[0]);
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                    data: response.data[0],
                    paymentFlag:true
                }));
            }
            else {
                console.log("******************************************************");
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                    data: response.data[0],
                    paymentFlag:false
                }));
            }
        } else {
            res.send(await Encrypt.jsonEncrypt({
                success: false,
                message: "tokenvalidation failed",
            }));
        }
    } catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 