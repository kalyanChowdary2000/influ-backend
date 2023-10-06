import express from 'express';
import cors from "cors";
import { MongoConnection } from './classes/mongo';
import { Config } from './config/credentials';
import { AWSServicesManager } from './classes/awsConnector';
import RedisConnector from './initializers/redisInit';
import signUp from './actions/login/signup'
import login from './actions/login/login'
import verifyInstagram from './actions/instagram/verifyInstagram';
import storeImage from './actions/login/storeImage';
import createAdd from './actions/add/createAdd';
import fetchInstagram from './actions/instagram/fetchInstagram';
import verifyYoutube from './actions/youtube/verifyYoutube';
import fetchYoutube from './actions/youtube/fetchYoutube';
import fetchAllInstagram from './actions/instagram/fetchAllInstagram';
import fetchAllYoutube from './actions/youtube/fetchAllYoutube';
import editUser from './actions/login/editUser';
import categoryInfluencers from './actions/general/categoryInfluencers'
const requestLogger = (req: any, res: any, next: any) => {
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Query Params:`, req.query);
    console.log(`Request Body:`, req.body);
    console.log("---------------------------------------");
    next();
};

export class MainServer {
    static app: any;
    async initialize() {
        MainServer.app = express();
        MainServer.app.use(express.json({ limit: '500mb' }));
        MainServer.app.use(express.urlencoded({ limit: '500mb', extended: true }));
        MainServer.app.use(cors());
        MainServer.app.use(requestLogger);
        MainServer.app.listen('6060');
        console.log("app is listening on 6060")
        await MongoConnection.initialization(Config.mongo.url);
        console.log("mongo connected");
        await RedisConnector.initialise(Config.redis.url, Config.redis.password);
        console.log("redis connected");
        await AWSServicesManager.initialize();
        console.log("aws initialized")
        await this.start();
    }
    async start() {
        MainServer.app.get('/', (req: any, res: any) => {
            res.send('<marquee><h1>Kalyan</h1></marquee>');
        })
        MainServer.app.use('/signIn', signUp);
        MainServer.app.use('/login', login);
        MainServer.app.use('/verifyInstagram', verifyInstagram);
        MainServer.app.use('/storeProfile', storeImage);
        MainServer.app.use('/createAdd',createAdd);
        MainServer.app.use('/fetchInstagram',fetchInstagram);
        MainServer.app.use('/verifyYoutube',verifyYoutube);
        MainServer.app.use('/fetchYoutube',fetchYoutube);
        MainServer.app.use('/fetchAllInstagram',fetchAllInstagram);
        MainServer.app.use('/fetchAllYoutube',fetchAllYoutube);
        MainServer.app.use('/editUser', editUser);
        MainServer.app.use('/categoryInfluencers',categoryInfluencers);
    }
}


(async () => {
    const mainserver = new MainServer();
    await mainserver.initialize();
})()
