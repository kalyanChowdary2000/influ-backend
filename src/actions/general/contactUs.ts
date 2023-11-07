import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
import { Instagram } from '../../classes/instagram';
import { Youtube } from '../../classes/youtube';
import { makeid } from '../../utils/generalFunctions';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> contact us ")
        const { query_title, query_content, contactDetails
        } = req.body
        await MongoConnection.addContact({
            _id: makeid(6),
            queryTittle: query_title,
            queryContent: query_content,
            contactDetails: contactDetails,
            active: true
        })
        res.send(await Encrypt.jsonEncrypt({
            success: true,
        }));
    } catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 