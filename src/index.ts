import express from 'express';
import cors from "cors";

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
        await this.start();
    }
    async start() {
        MainServer.app.get('/', (req: any, res: any) => {
            res.send('<marquee><h1>Kalyan</h1></marquee>');
        })
    }
}


(async () => {
    const mainserver = new MainServer();
    await mainserver.initialize();
})()
