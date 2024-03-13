import axios from "axios";
import { MongoConnection } from "./mongo";
import { Config } from "../config/credentials";
import cron from 'node-cron';
import { asyncDelay } from "../utils/generalFunctions";
export class Youtube {
    static async createItem(channelId: string, userId: string) {
        try {
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
        } catch (e: any) {
            return false

        }
    }
    static async initialize() {
        cron.schedule('0 3 * * *', async () => {
            await this.updateYoutubeData();
        }, {
            scheduled: true,
            timezone: 'Asia/Kolkata', // Replace with your timezone, e.g., 'America/New_York'
        });
    }
    static async updateYoutubeData() {
        try {
            console.log("updating Youtube after 30 min from now ", new Date().toLocaleDateString(), new Date().toLocaleTimeString());

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
                    await asyncDelay(3000);
                } catch (e: any) {
                    console.log(e);
                }
            }

        } catch (e: any) {
            console.log(e);
        }
    }
}