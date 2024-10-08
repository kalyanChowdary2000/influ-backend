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
import { Instagram } from './classes/instagram';
import { Youtube } from './classes/youtube';
import encrypt from './actions/transaction/encrypt';
import addTransaction from './actions/transaction/addTransaction';
import companySignIn from './actions/login/companySignup';
import fetchAdd from './actions/add/fetchAdd';
import uploadMedia from './actions/add/uploadAdd';
import fetchInfluAdd from './actions/add/fetchInfluAdd';
import testAdd from './actions/add/testAdd';
import bodyParser from 'body-parser';
import verifyAdd from './actions/add/verifyAdd';
import fetchComAdd from './actions/add/fetchComAdd';
import { RunningStatus } from './classes/runningStatus';
import addInstagram from './actions/instagram/addInstagram';
import addYoutube from './actions/youtube/addYoutube';
import fetchRunningAdds from './actions/add/fetchRunningAdds';
import deleteUser from './actions/login/deleteUser';
import addContactUs from './actions/general/contactUs';
import addTestAdd from './actions/add/addTestAdd';
import fetchTestAdd from './actions/add/fetchTestAdd';
import fetchWallet from './actions/transaction/fetchWallet';
import fetchTransaction from './actions/transaction/fetchTransactions'
import changePassword from './actions/login/changePassword';
import decrypt from './actions/transaction/decrypt';
import paymentFlag from './actions/login/paymentFlag';
import forgotPassword from './actions/login/forgotPassword';
import paymentFlagVerification from './actions/login/paymentFlagVerificaiton'
import activateFlag from './actions/login/activateFlag';
import fetchGlobalAdd from './actions/add/fetchGlobalAdd';
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
        MainServer.app.use(bodyParser.raw({ type: 'application/octet-stream' }));
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
        Instagram.initialize();
        Youtube.initialize();
        RunningStatus.updateRunningStatus();
        await this.start();
    }
    async start() {
       
        MainServer.app.get('/', (req: any, res: any) => {
            res.send('<marquee><h1>Azhana</h1></marquee>');
        })
        MainServer.app.use('/signIn', signUp);
        MainServer.app.use('/login', login);
        MainServer.app.use('/verifyInstagram', verifyInstagram);
        MainServer.app.use('/storeProfile', storeImage);
        MainServer.app.use('/createAdd', createAdd);
        MainServer.app.use('/fetchInstagram', fetchInstagram);
        MainServer.app.use('/verifyYoutube', verifyYoutube);
        MainServer.app.use('/fetchYoutube', fetchYoutube);
        MainServer.app.use('/fetchAllInstagram', fetchAllInstagram);
        MainServer.app.use('/fetchAllYoutube', fetchAllYoutube);
        MainServer.app.use('/editUser', editUser);
        MainServer.app.use('/categoryInfluencers', categoryInfluencers);
        MainServer.app.use('/encrypt', encrypt);
        MainServer.app.use('/addTransaction', addTransaction);
        MainServer.app.use('/companySignIn', companySignIn);
        MainServer.app.use('/fetchAdd', fetchAdd);
        MainServer.app.use('/uploadMedia', uploadMedia);
        MainServer.app.use('/testAdd', testAdd);
        MainServer.app.use('/fetchInfluAdd', fetchInfluAdd);
        MainServer.app.use('/fetchGlobalAdd', fetchGlobalAdd);
        MainServer.app.use('/verifyAdd', verifyAdd);
        MainServer.app.use('/fetchComAdd', fetchComAdd);
        MainServer.app.use('/addInstagram', addInstagram);
        MainServer.app.use('/addYoutube', addYoutube);
        MainServer.app.use('/fetchRunningAdds', fetchRunningAdds);
        MainServer.app.use('/deleteUser', deleteUser);
        MainServer.app.use('/addContactUs', addContactUs);
        MainServer.app.use('/addTestAdd', addTestAdd);
        MainServer.app.use('/fetchTestAdd', fetchTestAdd);
        MainServer.app.use('/fetchWallet', fetchWallet);
        MainServer.app.use('/fetchTransaction', fetchTransaction);
        MainServer.app.use('/changePassword',changePassword);
        MainServer.app.use('/forgotPassword',forgotPassword);
        MainServer.app.use('/decrypt',decrypt);
        MainServer.app.use('/paymentFlag',paymentFlag);
        MainServer.app.use('/paymentFlagVerification',paymentFlagVerification);
        MainServer.app.use('/activateFlag',activateFlag);
    }
}


(async () => {
    const mainserver = new MainServer();
    await mainserver.initialize();
})()
