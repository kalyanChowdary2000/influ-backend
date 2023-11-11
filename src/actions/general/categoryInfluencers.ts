import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {

        let mongoResponse:any ;
        if(req.body.maleFlag && req.body.femaleFlag){
        mongoResponse=await MongoConnection.findAllUsers();
        }
        else if(req.body.maleFlag){
            mongoResponse=await MongoConnection.findUser({gender:"male"});
        }else if(req.body.femaleFlag){
            console.log("--------------------------------")
            mongoResponse=await MongoConnection.findUser({gender:"female"});
        }
        let userData: any = mongoResponse.data;
        console.log(userData, req.body.category)
        let instagramInfluencerCount = 0;
        let youtubeInfluencerCount = 0;
        let instagramFollowerCount = 0;
        let instagramEr = 0;
        let youtubeFollowerCount = 0;
        let youtubeEr = 0;
        for (let i = 0; i < userData.length; i++) {
            let categoryList = userData[i].category;
            for (let j = 0; j < categoryList.length; j++) {
                //console.log(categoryList[j], req.body.category);
                if (categoryList[j] == req.body.category) {
                    if (userData[i].instagram != '' && req.body.instaFlag) {
                        let igData:any = await MongoConnection.fetchInstagram(userData[i].instagram)
                        //console.log('ig Data is ', igData,igData.data.followerCount);
                        instagramFollowerCount=instagramFollowerCount+igData.data.followerCount;
                        instagramEr=igData.data.engagementRate;
                        instagramInfluencerCount++;
                    }
                    if(userData[i].youtube!="" && req.body.ytFlag){
                        let ytData:any = await MongoConnection.fetchYoutube(userData[i].youtube)
                        //console.log('ytData  is ', ytData,ytData.data.followerCount);
                        youtubeFollowerCount=youtubeFollowerCount+parseInt(ytData.data.followerCount);
                        youtubeEr=ytData.data.engagementRate;
                        youtubeInfluencerCount++;
                    }
                    break;
                }
            }
        }
        res.send(await Encrypt.jsonEncrypt({
            success: true,
            data: {
                instagramInfluencerCount:instagramInfluencerCount,
                instagramFollowerCount:instagramFollowerCount,
                instagramEr:instagramInfluencerCount>0?(instagramEr/instagramInfluencerCount):0,
                youtubeInfluencerCount:youtubeInfluencerCount,
                youtubeFollowerCount:youtubeFollowerCount,
                youtubeEr:youtubeInfluencerCount>0?(youtubeEr/youtubeInfluencerCount):0,
            }
        }));
    } catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 