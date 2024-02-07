import axios from "axios";
import { MongoConnection } from "./mongo";
import { Config } from "../config/credentials";

export class Instagram {
    static async createItem(instagramId: string, userId: string) {
        try {
            console.log("instagram create Item", instagramId, userId)
            let axiosResponse = await axios.post(`${Config.pythonUrl}/get_engagement_rate`, {
                username: instagramId
            })
            console.log(axiosResponse.data)
            let followerCount = axiosResponse.data.followers_count;
            let engagementRate = axiosResponse.data.engagement_rate;
            let reach = followerCount * engagementRate;
            await MongoConnection.addInstagram({
                _id: instagramId,
                userId: userId,
                followerCount: followerCount,
                engagementRate: engagementRate,
                reach: reach
            })
            return {
                followerCount: followerCount,
                engagementRate: engagementRate,
                reach: reach
            }
        } catch (e: any) {
            return false;
        }
    }
    static async updateInstagramData() {
        try {
            console.log("updating instagram after 30 min from now ", new Date().toLocaleDateString(), new Date().toLocaleTimeString());
            setInterval(async () => {
                let data: any = await MongoConnection.findAllUsers();
                let userData = data.data
                for (let i = 0; i < userData.length; i++) {
                    try {
                        let instagramId = userData[i].instagram;
                        let axiosResponse = await axios.post(`${Config.pythonUrl}/get_engagement_rate`, {
                            username: instagramId
                        })
                        console.log(axiosResponse.data)
                        let followerCount = axiosResponse.data.followers_count;
                        let engagementRate = axiosResponse.data.engagement_rate;
                        let reach = followerCount * engagementRate;
                        console.log("-----------------------------------------------instagram")
                        await MongoConnection.updateInstagram(instagramId, {
                            followerCount: followerCount,
                            engagementRate: engagementRate,
                            reach: reach
                        })
                    } catch (e: any) {
                        console.log(e);
                    }
                }
            }, 1000 * 60 * 60*2);
        } catch (e: any) {
            console.log(e)
        }
    }
}






