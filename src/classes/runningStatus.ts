import axios from "axios";
import { MongoConnection } from "./mongo";
import { Config } from "../config/credentials";
import { asyncDelay } from "../utils/generalFunctions";

export class RunningStatus {

    static async updateRunningStatus() {
        try {
            console.log("updating running add status after 30 min from now ", new Date().toLocaleDateString(), new Date().toLocaleTimeString());
            
            setInterval(async () => {
                let data: any = await MongoConnection.fetchAllComAdd();
                console.log("--------------- com add data ", data);
                let comAddData = data.data;
                let instaAxiosResponse;
                let ytAxiosResponse;
                //let AuthResposne=await axios.post(`${Config.pythonUrl}/login`);
                for (let i = 0; i < comAddData.length; i++) {
                    if (comAddData[i].instaFlag) {
                        try {
                            console.log(comAddData[i].instagram, comAddData[i].instaPostLink)
                            instaAxiosResponse = await axios.post(`${Config.pythonUrl}/get_instagram_post_metrics`, {
                                "username": comAddData[i].instagram,
                                "shortcode": comAddData[i].instaPostLink
                            })
                            console.log(instaAxiosResponse.data)
                            await MongoConnection.editComAdd({ _id: comAddData[i]._id }, { instaData: instaAxiosResponse.data });
                            await asyncDelay(3000);
                        } catch (e: any) {
                            console.log(e);
                        }
                    }
                    if (comAddData[i].ytFlag) {
                        console.log(comAddData[i].youtube, comAddData[i].ytPostLink);
                        try {
                            ytAxiosResponse = await axios.post(`${Config.pythonUrl}/get_youtube_video_metrics`, {
                                "videoId": comAddData[i].ytPostLink,
                                "developerKey": "AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
                            })
                            console.log(ytAxiosResponse.data);
                            await MongoConnection.editComAdd({ _id: comAddData[i]._id }, { ytData: ytAxiosResponse.data });
                            await asyncDelay(3000);
                        } catch (e: any) {
                            console.log(e);
                        }
                        console.log("---------------------------------------------------------------------------------  ", i);
                    }
                }
            }, 1000 * 60 * 60 * 4)
        } catch (e: any) {
            console.log(e);
        }
    }
    static async immediateUpdate(id:any){
        try {
            console.log("updating running add status immediately ", new Date().toLocaleDateString(), new Date().toLocaleTimeString());
                let data: any = await MongoConnection.fetchComAdd({_id:id});
                console.log("--------------- com add data ", data);
                let comAddData = data.data;
                let instaAxiosResponse;
                let ytAxiosResponse;
                for (let i = 0; i < comAddData.length; i++) {
                    if (comAddData[i].instaFlag) {
                        try {
                            console.log(comAddData[i].instagram, comAddData[i].instaPostLink)
                            instaAxiosResponse = await axios.post(`${Config.pythonUrl}/get_instagram_post_metrics`, {
                                "username": comAddData[i].instagram,
                                "shortcode": comAddData[i].instaPostLink
                            })
                            console.log(instaAxiosResponse.data)
                            await MongoConnection.editComAdd({ _id: comAddData[i]._id }, { instaData: instaAxiosResponse.data });
                        } catch (e: any) {
                            console.log(e);
                        }
                    }
                    if (comAddData[i].ytFlag) {
                        console.log(comAddData[i].youtube, comAddData[i].ytPostLink);
                        try {
                            ytAxiosResponse = await axios.post(`${Config.pythonUrl}/get_youtube_video_metrics`, {
                                "videoId": comAddData[i].ytPostLink,
                                "developerKey": "AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
                            })
                            console.log(ytAxiosResponse.data);
                            await MongoConnection.editComAdd({ _id: comAddData[i]._id }, { ytData: ytAxiosResponse.data });
                        } catch (e: any) {
                            console.log(e);
                        }
                        console.log("---------------------------------------------------------------------------------  ", i);
                    }
                }
                return true;
           
        } catch (e: any) {
            console.log(e);
            return false
        }
    }
}