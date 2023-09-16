import crypto from 'crypto';
import { Config } from '../config/credentials';
import pbkdf2 from 'pbkdf2';

export class Encrypt {
    static encryptionKey = pbkdf2.pbkdf2Sync(Config.encryptionString, 'salt', 1, 32, 'sha512');
    static async jsonEncrypt(data: any) {
        try {
            const key = this.encryptionKey
            const initVector = key.slice(0, 16);
            const cipher = crypto.createCipheriv('aes-256-cbc', key, initVector);
            let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'base64');
            encryptedData += cipher.final('base64');
            return encryptedData;
        }
        catch (e: any) {
            console.log("error is ", e);
            return e.toString();
        }
    }

}