import express from 'express';
import { MongoConnection } from '../../classes/mongo';
import { mongo } from 'mongoose';
import { TokenHandler } from '../../classes/tokenManagement';
import { Encrypt } from '../../classes/encrypt';
const stringHash = require("string-hash");
const router = express.Router();
router.post("/", async (req: any, res: any) => {
    try {
        let tokenCheck = await TokenHandler.validateToken(req.body.token);
        if (tokenCheck) {
            let response = await MongoConnection.deleteUser(req.body._id);
            if (response) {
                await TokenHandler.deleteKey(req.body.token);
                res.send(await Encrypt.jsonEncrypt({
                    success: true,
                }));
            } else {
                res.send(await Encrypt.jsonEncrypt({
                    success: false,
                }));
            }
        } else {
            res.send(await Encrypt.jsonEncrypt({
                success: false,
                message: "tokenvalidation failed",
            }));
        }
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: `This is an error! ${e}`
        });
    }
})
export default router; 