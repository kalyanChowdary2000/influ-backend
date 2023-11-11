import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import axios from 'axios';
import https from 'https';
import { Config } from '../../config/credentials';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> youtube verification ")
        const { channelLink, verificationCode
        } = req.body
        let channelData: any = await axios.get(channelLink);
        const data = channelData.data;
        const arr = data.split('channel_id=');
        let channelId=arr[1].slice(0, 24)
        //console.log("channel Id is")
        console.log("Channel ID:",channelId );
        let axiosResponse=await axios.post(`${Config.pythonUrl}/get_youtube_bio`,{
            channelId:channelId,
            developerKey:"AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
        })
        console.log(axiosResponse.data)
        let description=axiosResponse.data.description;
        console.log(description.includes(verificationCode));
        if(!description.includes(verificationCode)){
            res.send(await Encrypt.jsonEncrypt({
                success:true,
                customUrl:axiosResponse.data.customUrl,
                channelId:channelId
            }));
        }else{
            res.send(await Encrypt.jsonEncrypt({
                success:false
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