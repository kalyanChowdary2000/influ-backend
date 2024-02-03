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
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> encrypt data ")
        const { token } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log("user data is ---->", userData);
        if (userData.data.length != 0) {
            let returnUrl = "https://khwajamerekhwaja.com:8082/decrypt";
            let isTesting = req.body.isTesting ? req.body.isTesting : false;
            let order_id = makeid(9);
            let encryptedData = ccavenue.getEncryptedOrder({
                //  "merchant_id": "2566643",
                "order_id": order_id,
                "currency": 'INR',
                "amount": 1,
                "billing_name": userData.data.name ? userData.data.name : " ",
                "billing_address": "sample",
                "billing_city": "testCity",
                "billing_state": "testState",
                "billing_zip": 123456,
                "billing_country": "India",
                "billing_tel": userData.data._id,
                "billing_email": "azhanatech@gmail.com",
               // userData.data.email ? userData.data.email : "azhanatechnologies@gmail.com",
                "redirect_url": returnUrl,
                "cancel_url": returnUrl
            })
            let url = "";
            if (!isTesting) {
                url = `https://secure.ccavenue.com/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${Config.ccavenurCred.prod.access_key}`;

            }
            else {
                url = `https://test.ccavenue.com/transaction.do?command=initiateTransaction&encRequest=${encryptedData}&access_code=${Config.ccavenurCred.prod.access_key}`;

            }
            console.log("----------------- url is", url);
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                data: {
                    url: url,
                    orderId: order_id,
                    amount: 500,
                }
            }))
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

