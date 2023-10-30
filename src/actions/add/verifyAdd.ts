import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import axios from 'axios';
import { TokenHandler } from '../../classes/tokenManagement';
import { MongoConnection } from '../../classes/mongo';
import { makeid } from '../../utils/generalFunctions';
const { ObjectId } = require('mongodb');
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> Add verification ")
        const { token, addId
        } = req.body
        let instaFlag: Boolean = false;
        let youtubeFlag: Boolean = false;
        let userData: any = await TokenHandler.fetchToken(token);
        let addData: any = await MongoConnection.fetchAdd({ tittle: addId })
        console.log("add data is ---->", addData.data[0]);
        let instaAxiosResponse: any;
        let ytAxiosResponse: any;
        if (userData.data.length != 0) {
            console.log(userData);
            if (userData.data.youtube && addData.data[0].ytFlag) {
                ytAxiosResponse = await axios.post('http://127.0.0.1:6061/get_latest_yt_video_info', {
                    channelId: userData.data.youtube,
                    developerKey: "AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
                })
                console.log("youtube data   ", ytAxiosResponse.data);
                if (ytAxiosResponse.data.description) {
                    let ytDescription = ytAxiosResponse.data.description
                    console.log("yt description check ------", ytDescription.includes(addId))
                    if (ytDescription.includes(addId)) {
                        youtubeFlag = true;
                    }
                }
            }
            if (userData.data.instagram && addData.data[0].instaFlag) {
                instaAxiosResponse = await axios.post('http://127.0.0.1:6061/get_latest_insta_post_info', {
                    username: userData.data.instagram,
                })
                console.log("instagram data ", instaAxiosResponse.data);
                if (instaAxiosResponse.data.description) {
                    let instaDescription = instaAxiosResponse.data.description
                    console.log("insta description check ------", instaDescription.includes(addId))
                    if (instaDescription.includes(addId)) {
                        instaFlag = true;
                    }
                }
            }
            if(!instaFlag&&!youtubeFlag){
                await MongoConnection.addComAdd({
                    _id:makeid(6),
                    addData:addData.data[0],
                    addId:addData.data[0]._id,
                    influId:userData.data._id,
                    instagram:userData.data.instagram,
                    youtube:userData.data.youtube,
                    instaFlag:true,
                    ytFlag:true,
                    ytPostLink:ytAxiosResponse.data.video_id,
                    instaPostLink:instaAxiosResponse.data.shortcode,
                    active:true
                })
            }
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                instaFlag: !instaFlag,
                ytFlag: !youtubeFlag
            }));
        }
        // let axiosResponse=await axios.post('http://127.0.0.1:6061/get_youtube_bio',{
        //     channelId:channelId,
        //     developerKey:"AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
        // })
        // console.log(axiosResponse.data)
        // let description=axiosResponse.data.description;
        // console.log(description.includes(verificationCode));
        // if(!description.includes(verificationCode)){
        //     res.send(await Encrypt.jsonEncrypt({
        //         success:true,
        //         customUrl:axiosResponse.data.customUrl,
        //         channelId:channelId
        //     }));
        // }else{
        //     res.send(await Encrypt.jsonEncrypt({
        //         success:false
        //     }));
        // }

    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 