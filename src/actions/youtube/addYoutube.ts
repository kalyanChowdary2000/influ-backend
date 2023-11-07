import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
import { Instagram } from '../../classes/instagram';
import { Youtube } from '../../classes/youtube';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> add Instagram ")

        const { token,youtube
        } = req.body
        let userData=await TokenHandler.fetchToken(token);
        console.log(userData);
        
        if(userData!=null){
            await Youtube.createItem(youtube, userData.data._id);
            let response:any =await MongoConnection.editUser(userData.data._id,{youtube:youtube});
            console.log("updated data is", response)
            await TokenHandler.updateToken(req.body.token, response);
            if (response) {
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                    data:response
                }));
            } else {
                res.send(await Encrypt.jsonEncrypt({
                    success: false,
                }));
            }
        }
        else{
            res.send({
                success:false
            })
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