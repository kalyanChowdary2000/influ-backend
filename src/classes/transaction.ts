import { makeid } from "../utils/generalFunctions";
import { MongoConnection } from "./mongo";

export class Transaction{
    static async addTransaction(userId:any,amount:any,isDeposit:any,accountHolderName:String,accountNumber:String,ifscCode:String,branch:String,bankName:String){
        try{
            if(isDeposit){
                let user:any=await MongoConnection.findUser({_id:userId});
                console.log(user.data[0].walletMoney)
                await MongoConnection.editUser({_id:userId},{walletMoney:parseInt(user.data[0].walletMoney+amount)})
                let mongoResponse: any = await MongoConnection.addTransaction({
                    userId: userId,
                    _id: makeid(6),
                    amount: amount,
                    status:true,
                    createTime: new Date().getTime(),
                    isDeposit:true
                })
                return {
                    success:true
                }
                
            
            }
            else{
                let user:any=await MongoConnection.findUser({_id:userId});
                console.log(user.data[0].walletMoney)
                if(user.data[0].walletMoney-amount>0){
                    let activeBalance=user.data[0].walletMoney-amount
                    await MongoConnection.editUser({_id:userId},{walletMoney:activeBalance});
                    let mongoResponse: any = await MongoConnection.addTransaction({
                        userId: userId,
                        _id: makeid(6),
                        amount: amount,
                        status:false,
                        createTime: new Date().getTime(),
                        isDeposit:false,
                        accountHolderName:accountHolderName,  // Provide the value if needed
                        accountNumber: accountNumber,          // Provide the value if needed
                        ifscCode: ifscCode,                    // Provide the value if needed
                        branch: branch,                        // Provide the value if needed
                        bankName: bankName,
                    })
                    return{
                        success:true
                    }
                }
                else{
                    return {
                        success:false
                    }
                }
            }
        }catch(e){

        }
    }
}