import express from 'express';
import axios from "axios";
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { Config } from '../../config/credentials';
import { makeid } from '../../utils/generalFunctions';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> forgot Password")
        const { _id } = req.body
        let mongoResponse: any = await MongoConnection.findUserById(_id);
        console.log(mongoResponse)
        if (mongoResponse.success && mongoResponse.data.length != 0) {
            let newPassword = makeid(6);
            let message = `Hi , Great news! We've reset your password for Beinfluencer. Your new password is: ${newPassword}. For security, please change your password after logging in. Need help? Contact azhanatechnologies@gmail.com. Azhana Team`;
            let url = `https://www.smsstriker.com/API/sms.php?username=${Config.smsStriver.username}&password=${Config.smsStriver.password}&from=${Config.smsStriver.from}&to=${_id}&msg=${message}&type=1&template_id=${Config.smsStriver.templateId}`;
            await MongoConnection.editUser({ _id: _id }, { password: stringHash(newPassword) });
            const response = await axios.get(url);
            console.log('Response:', response.data);
            res.send(await Encrypt.jsonEncrypt({
                success: true
            }));
        }else{
            res.send(await Encrypt.jsonEncrypt({
                success: false
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