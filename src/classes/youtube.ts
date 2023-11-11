import axios from "axios";
import { MongoConnection } from "./mongo";
import { Config } from "../config/credentials";

export class Youtube {
    static async createItem(channelId: string, userId: string) {
        console.log("youtube create Item", channelId, userId)
        let axiosResponse = await axios.post(`${Config.pythonUrl}/get_yt_engagement_rate`, {
            channelId: channelId,
            developerKey: "AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
        })
        console.log(axiosResponse.data)
        let followerCount = axiosResponse.data.subscriberCount;
        let engagementRate = axiosResponse.data.engagementRate;
        let reach = followerCount * engagementRate;
        await MongoConnection.addYoutube({
            _id: channelId,
            userId: userId,
            followerCount: followerCount,
            engagementRate: engagementRate,
            reach: reach,
            customUrl: axiosResponse.data.customUrl
        }
        )
        return {
            followerCount: followerCount,
            engagementRate: engagementRate,
            reach: reach
        }
    }
    static async updateYoutubeData() {
        try {
            console.log("updating Youtube after 30 min from now ", new Date().toLocaleDateString(), new Date().toLocaleTimeString());
            setInterval(async () => {
                let data: any = await MongoConnection.findAllUsers();
                let userData = data.data
                for (let i = 0; i < userData.length; i++) {
                    try {
                        let channelId = userData[i].youtube;
                        let axiosResponse = await axios.post(`${Config.pythonUrl}/get_yt_engagement_rate`, {
                            channelId: channelId,
                            developerKey: "AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
                        });
                        console.log(axiosResponse.data)
                        let followerCount = axiosResponse.data.subscriberCount;
                        let engagementRate = axiosResponse.data.engagementRate;
                        let reach = followerCount * engagementRate;
                        console.log("-----------------------------------------------youtube")
                        await MongoConnection.updateYoutube(channelId, {
                            followerCount: followerCount,
                            engagementRate: engagementRate,
                            reach: reach
                        })
                    } catch (e: any) {
                        console.log(e);
                    }
                }
            }, 1000 * 60 * 60);
        } catch (e: any) {
            console.log(e);
        }
    }
}