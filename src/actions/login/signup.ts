import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
import { Instagram } from '../../classes/instagram';
import { Youtube } from '../../classes/youtube';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        console.log("---------->> sign in ")
        const { email,
            name,
            phone,
            password,
            instagram,
            youtube,
            dob,
            gender
        } = req.body
        if (instagram != "") {
            await Instagram.createItem(instagram.trim(), phone);
        }
        if (youtube != "") {
            await Youtube.createItem(youtube.trim(), phone)
        }
        let mongoResponse = await MongoConnection.addUser({
            _id: phone,
            name: name,
            email: email,
            password: stringHash(password),
            walletMoney: 0,
            role: "influ",
            active:false,
            instagram: instagram.trim(),
            youtube: youtube,
            dob: dob,
            gender: gender,
            imageLink: "https://azhanaresources.s3.ap-south-1.amazonaws.com/images/first_profile.png"
        })

        console.log(">>>>>>>>>>>>>>>> ", mongoResponse);

        if (mongoResponse.success) {
            let token = await TokenHandler.generateToken({
                _id: phone,
                name: name,
                email: email,
                password: stringHash(password),
                role: "influ",
                instagram: instagram.trim(),
                youtube: youtube,
                dob: dob,
                walletMoney: 0,
                gender: gender,
                imageLink: "https://azhanaresources.s3.ap-south-1.amazonaws.com/images/first_profile.png"
            });
            res.send(await Encrypt.jsonEncrypt({
                success: true,
                data: {
                    _id: phone,
                    name: name,
                    email: email,
                    instagram: instagram.trim(),
                    youtube: youtube,
                    dob: dob,
                    walletMoney: 0,
                    gender: gender,
                    imageLink: "https://azhanaresources.s3.ap-south-1.amazonaws.com/images/first_profile.png"
                },
                token: token
            }));
        }
        else {
            throw new Error(mongoResponse.error)
        }
    } catch (e: any) {
        console.log(e);
        res.status(400).send(await Encrypt.jsonEncrypt({
            success: false,
            message: `This is an error! ${e}`
        }));
    }
})
export default router; 