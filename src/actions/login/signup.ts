import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> sign in ")
        const { email,
            name,
            phone,
            password,
            instagramFlag,
            youtubeFlag
        } = req.body

        let mongoResponse = await MongoConnection.addUser({
            _id: phone,
            name: name,
            email: email,
            password: stringHash(password),
            role: "influ",
            instagram: instagramFlag,
            youtube: youtubeFlag
        })
        if (mongoResponse.success) {
            let token = await TokenHandler.generateToken({
                _id: phone,
                name: name,
                email: email,
                password: stringHash(password),
                role: "influ",
                instagram: instagramFlag,
                youtube: youtubeFlag
            });
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                data: {
                    _id: phone,
                    name: name,
                    email: email,
                    instagram: instagramFlag,
                    youtube: youtubeFlag
                },
                token: token
            }));
        }
        else {
            throw new Error(mongoResponse.error)
        }
    } catch (e: any) {
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 