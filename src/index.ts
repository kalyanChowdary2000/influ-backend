import express from 'express';
import cors from "cors";
import { MongoConnection } from './classes/mongo';
import { Config } from './config/credentials';
import RedisConnector from './initializers/redisInit';
import signUp from './actions/login/signup'


const requestLogger = (req: any, res: any, next: any) => {
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Query Params:`, req.query);
    console.log(`Request Body:`, req.body);
    console.log("--------------------------------------------------------------------------------------");
    next();
};

export class MainServer {
    static app: any;
    async initialize() {
        MainServer.app = express();
        MainServer.app.use(express.json());
        MainServer.app.use(cors());
        MainServer.app.use(requestLogger);
        MainServer.app.listen('6060');
        console.log("app is listening on 6060")
        await MongoConnection.initialization(Config.mongo.url);
        console.log("mongo connected");
        await RedisConnector.initialise(Config.redis.url, Config.redis.password);
        console.log("redis connected");
        await this.start();

    }
    async start() {
        MainServer.app.get('/', (req: any, res: any) => {
            res.send('<marquee><h1>Kalyan</h1></marquee>');
        })
        MainServer.app.use('/signIn', signUp);
    }
}


(async () => {
    const mainserver = new MainServer();
    await mainserver.initialize();
})()
