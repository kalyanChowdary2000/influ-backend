import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {

        let mongoResponse = await MongoConnection.fetchAllInstagram();
        let instagramData: any = mongoResponse.data;
        let followerCount = 0;
        let er = 0;
        let reach = 0;
        for (let i = 0; i < instagramData.length; i++) {
            followerCount = followerCount + instagramData[i].followerCount;
            er = er + instagramData[i].engagementRate
            reach = reach + instagramData[i].reach/10
        }
        console.log(mongoResponse)
        if (mongoResponse.success) {
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                data: {
                    followers: followerCount,
                    er: er / instagramData.length,
                    reach: reach,
                    influencerCount: instagramData.length
                }
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