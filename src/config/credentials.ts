export class Config{
    static mongo = {
        url: 'mongodb+srv://kalyan:kalyan@cluster0.gk2rqbh.mongodb.net/prod',
    };
    static redis = {
        // url:'redis://xozone_redis:6379',
        // password:"",
        // host:"xozone_redis",
        // port:6379,
        host:"redis-18492.c212.ap-south-1-1.ec2.cloud.redislabs.com",
        port:18492,
       url: 'redis://redis-18492.c212.ap-south-1-1.ec2.cloud.redislabs.com:18492',
       password: 'eTzRGb3VxijlFVotUxL2hbLZRgNm6JI3'
    };
    static encryptionKey='/tck8EIqBYxdrf1yPgMt9aA9/28ZI/g83KnLpWt1ojo=';
    static encryptionString='@kalyan_chowdary';
    static aws = {
        accessId: "AKIA3QZSA6AFNCNBGZ7H",
        sceretKey: "nZO62hdvVC9UCLeVfUH9EtKzueUi/qCdbLqGovQ+",
        region: "ap-south-1"
    }
    static ccavenurCred = {
        prod: {
            merchant_id: "2566643",
            access_key: "AVLV77KF82BE27VLEB",
            working_key: "8D897EB0340D9B711983F569722DB906"
        },
    }
    static pythonUrl="http://100.114.240.112:6061"
}