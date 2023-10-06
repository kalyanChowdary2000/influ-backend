import axios from "axios";
import { MongoConnection } from "./mongo";

export class Youtube{
    static async createItem(channelId:string,userId:string){
       console.log("youtube create Item",channelId,userId)
        let axiosResponse=await axios.post('http://127.0.0.1:6061/get_yt_engagement_rate',{
            channelId:channelId,
            developerKey:"AIzaSyDpX8JwD0z73piVfiTYYq-g0a6LvFqBMVs"
        })
        console.log(axiosResponse.data)
        let followerCount=axiosResponse.data.subscriberCount;
        let engagementRate=axiosResponse.data.engagementRate;
        let reach=followerCount*engagementRate;
        await MongoConnection.addYoutube({
            _id:channelId,
            userId:userId,
            followerCount:followerCount,
            engagementRate:engagementRate,
            reach:reach,
            customUrl:axiosResponse.data.customUrl
        }
        )
        return {
            followerCount:followerCount,
            engagementRate:engagementRate,
            reach:reach
        }
    }
}