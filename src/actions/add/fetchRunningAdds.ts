import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> fetch Running adds ")
        const { token
        } = req.body
        let userData: any = await TokenHandler.fetchToken(token);
        //console.log(userData," user data is");
        if (userData != null) {
            let mongoResponse = await MongoConnection.fetchAdd({ companyUserId: userData.data["_id"] });
            // console.log("------------------ adds data",mongoResponse)
            let addsData: any = mongoResponse.data;
            let runningAddsList: any = [];
            for (let i = 0; i < addsData?.length; i++) {
                if (addsData[i].approveStatus) {
                    let mongoResponse: any = await MongoConnection.fetchComAdd({ addId: addsData[i]["_id"] });
                    console.log(addsData[i]["_id"], mongoResponse.data[0]);
                    if (mongoResponse.data[0]) {
                        console.log("******************");
                        runningAddsList.push(mongoResponse.data[0]);
                    }
                }
            }

            if (mongoResponse.success) {
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                    data: runningAddsList

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
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 