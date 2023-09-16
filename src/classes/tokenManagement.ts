import { v4 as uuidv4 } from 'uuid';
import RedisConnector from '../initializers/redisInit';
export class TokenHandler {
    static async generateToken(data: any): Promise<string> {
        console.log(data, 'token data ')
        let client = RedisConnector.getAppRedisConnection();
        let key = uuidv4();
      let tokenResponse=  await client.set(key, JSON.stringify(data))
      console.log("------->> token resposne is ",tokenResponse);
        return key;
    }
    static async updateToken(key:any,data:any){
        let client = RedisConnector.getAppRedisConnection();
      let tokenResponse=  await client.set(key, JSON.stringify(data))
      console.log("------->> token resposne is ",tokenResponse);
        return key;
    }
    static async storeOrderId(id: any): Promise<string> {
        let client = RedisConnector.getAppRedisConnection();
        let key = uuidv4();
        let res = await client.set(id, "", { 'EX': 60 * 5 },)
        console.log("order id status", res)
        return key;
    }
    static async validateToken(matchPattern: string) {
        try {
            //return true;
            console.log(matchPattern, "----")
            let redisRes = await RedisConnector.getAppRedisConnection().keys(matchPattern);
            console.log(redisRes, "toekn response")
            return redisRes;

        }
        catch (e: any) {
            console.log(e)
            return false;
        }
    }
    static async deleteKey(key:string){
        try{
            console.log("deleting redis key is --->>>",key)
            let res=await RedisConnector.getAppRedisConnection().DEL(key);
            console.log("response from deleting redis key is --->>>",res)
            return res;
        }
        catch(e:any){
            console.log("error from deleting redis key is --->>>",e);
            return false;
        }
    }
    static async fetchToken(key: string) {
        try {
            console.log(key);
            let client = await RedisConnector.getAppRedisConnection();
            let data: any = await client.get(key);
            console.log(data)
            return {
                success: true,
                data: JSON.parse(data)
            }
        } catch (e) {
            return {
                success: false,
                error: e
            }
        }
    }
}