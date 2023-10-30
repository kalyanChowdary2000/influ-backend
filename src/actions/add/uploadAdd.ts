import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { Encrypt } from '../../classes/encrypt';
import { makeid } from '../../utils/generalFunctions';
import fs from 'fs/promises';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> upload pic ")
        const { imageData,videoData
        } = req.body
        let c=0;
        console.log(imageData.length)
        
        for(let i=0;i<imageData.length;i++){
            let bufferData=Buffer.from(imageData[i])
            console.log(bufferData);
            await fs.writeFile(`./sample${i}.jpg`, bufferData);
        }
        for(let i=0;i<videoData.length;i++){
            let bufferData=Buffer.from(videoData[i])
            console.log(bufferData);
            await fs.writeFile(`./sample${i}.mp4`, bufferData);
        }
    } catch (e: any) {
        console.log(e)
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 