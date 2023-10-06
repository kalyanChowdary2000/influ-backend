import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        let mongoResponse = await MongoConnection.findAllUsers();
        let userData: any = mongoResponse.data;
        console.log(userData,req.body.category)
        let influencerCount=0;
        for(let i=0;i<userData.length;i++){
            let categoryList=userData[i].category;
            for(let j=0;j<categoryList.length;j++){
                console.log(categoryList[j],req.body.category);
                if(categoryList[j]==req.body.category){
                    influencerCount++;
                    break;
                }
            }
            
        }
        res.send(await Encrypt.jsonEncrypt({
            success: true,
            data: {
                influencerCount: influencerCount
            }
        }));
    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 