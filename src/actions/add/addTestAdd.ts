import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> create test add ")
        const { tittle,
            description,
         //   driveLinks,
            category,
            userId,
            instaFlag,ytFlag
        } = req.body
        let mongoResponse = await MongoConnection.addTestAdd({
            _id: makeid(6),
            tittle: tittle,
            description: description,
            active:true,
            //socialMediaLinks: req.body.driveLinks?req.body.driveLinks:[],
            category:category,
            companyUserId:userId,
            //approveStatus:false,
            createdTime:new Date().getTime(),
            instaFlag:instaFlag,
            ytFlag:ytFlag
        })
        if (mongoResponse.success) {
            res.send(await Encrypt.jsonEncrypt({
                success: true,
            }));
        }
        else {
            res.send(await Encrypt.jsonEncrypt({
                success: false,
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