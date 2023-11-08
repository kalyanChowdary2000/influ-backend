import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
const stringHash = require("string-hash");
const router = express.Router();



router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> create add ")
        const { title,
            description,
            socialMediaLinks,
            category,
            companyUserId,
            instaFlag,ytFlag,tagPeopleList
        } = req.body
        let mongoResponse = await MongoConnection.addAdd({
            _id: makeid(6),
            tittle: title,
            description: description,
            socialMediaLinks: socialMediaLinks?socialMediaLinks:[],
            category:category,
            companyUserId:companyUserId,
            approveStatus:true,
            createdTime:new Date().getTime(),
            instaFlag:instaFlag,
            ytFlag:ytFlag,
            tagPeopleList:tagPeopleList?tagPeopleList:[]
        })
        console.log("------------- mongo resopnse is ",mongoResponse.success)
        if (mongoResponse.success) {
            res.send({
                success: true,
            });
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