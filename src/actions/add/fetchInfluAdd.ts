import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch influ add ")
        const { token
        } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        console.log(userData, " user data is");
        if (userData != null) {
            console.log("-------------------------------")
            let mongoResponse = await MongoConnection.fetchAdd({ approveStatus: true });
            let addData: any = mongoResponse.data;
            let categoryFlag = false
            let influAddData=[]
            console.log(addData.length)
            for (let i = 0; i < addData?.length; i++) {
                let userCategory: any = userData.data.category;
                categoryFlag = false
               // console.log(addData[i]['category'],userData.data.category)
                for (let j = 0; j < userCategory.length; j++) {
                    console.log(i,addData[i]['category'],userCategory[j])
                    if (addData[i]['category'] == userCategory[j]) {
                       // categoryFlag = true;

                        if(userData.data.instagram!=null || userData.data.youtube!=null){
                            categoryFlag = true;
                            influAddData.push(addData[i])
                            break;
                        }
                    }
                }
                console.log(categoryFlag)

            }
            console.log(mongoResponse, "youtube data from db")
            console.log(influAddData);
            if (mongoResponse.success) {
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                    data: influAddData
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
                error: "token  is invalid"
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