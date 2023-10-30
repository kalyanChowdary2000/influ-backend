import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch add ")
        const { token,id
        } = req.body
        let userData:any=await TokenHandler.fetchToken(token);
        console.log(userData," user data is");
        if(userData!=null){
        let mongoResponse = await MongoConnection.fetchAdd({companyUserId:id});
        console.log(mongoResponse,"youtube data from db")
        if (mongoResponse.success) {
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                data:mongoResponse.data
            }));
        }
        else {
            res.send(await Encrypt.jsonEncrypt({
                success: false,
            }));
        }
    }
    else {
        res.send(await Encrypt.jsonEncrypt({
            success: false,
            error:"token  is invalid"
        }));
    }
    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 