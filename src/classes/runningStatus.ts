import axios from "axios";
import { MongoConnection } from "./mongo";

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
                for (let i = 0; i < comAddData.length; i++) {
                    if (comAddData[i].instaFlag) {
                        try {
                            console.log(comAddData[i].instagram, comAddData[i].instaPostLink)
                            instaAxiosResponse = await axios.post('http://127.0.0.1:6061/get_instagram_post_metrics', {
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
                            ytAxiosResponse = await axios.post('http://127.0.0.1:6061/get_youtube_video_metrics', {
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
            }, 1000 * 60 * 60)
        } catch (e: any) {
            console.log(e);
        }
    }
}