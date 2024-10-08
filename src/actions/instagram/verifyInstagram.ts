import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import axios from 'axios';
import { Config } from '../../config/credentials';
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> sign in ")
        const { username,verificationCode
        } = req.body
       // let AuthResposne=await axios.post(`${Config.pythonUrl}/login`);
        let axiosResponse=await axios.post(`${Config.pythonUrl}/get_instagram_bio`,{
            username:username.trim()
        })
        console.log(axiosResponse.data)
        let bio=axiosResponse.data.bio;
        console.log(bio.includes(verificationCode));
        if(bio.includes(verificationCode)){
            res.send(await Encrypt.jsonEncrypt({
                success:true
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