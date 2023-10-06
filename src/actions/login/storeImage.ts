import express from 'express';
import { Encrypt } from '../../classes/encrypt';
import fs from 'fs/promises'
import { AWSServicesManager } from '../../classes/awsConnector';
import { MongoConnection } from '../../classes/mongo';
const stringHash = require("string-hash");
const router = express.Router();

router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> profile pic ")
        const { imageData, id
        } = req.body
        let bufferData=Buffer.from(imageData)
        await fs.writeFile('./sample.jpg', bufferData);
        let imageStrData=await fs.readFile('./sample.jpg','base64');
        const base64Data = Buffer.from(imageStrData.replace(/^data:application\/\w+;base64,/, ""), "base64");
        let params = {
            Key: `images/${id}.jpg`,
            Body: base64Data,
            Bucket: 'azhanaresources',
            ContentType: 'image/jpeg',
            ContentEncoding: 'base64',
            ACL: 'public-read'
        }
        console.log(params);
        let uploadResponse = await AWSServicesManager.getS3Client().putObject(params)
        console.log("uploading file in aws ", uploadResponse);
        let response = await MongoConnection.editUser(
            {_id:id},
            { 'imageLink': `https://azhanaresources.s3.ap-south-1.amazonaws.com/images/${id}.jpg` }
        );
        res.send(await Encrypt.jsonEncrypt({
            success: true,
            data: response
        }));
       
    } catch (e: any) {
        console.log(e)
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 