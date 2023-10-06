import { S3 } from "@aws-sdk/client-s3";
import { Config } from "../config/credentials";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb/dist-types/DynamoDBClient";

export class AWSServicesManager {
    private static s3Client: S3;
    private static dynamodbClient: DynamoDBClient;
    private static dynamodbDocClient: DynamoDBDocument;
    static async initialize() {
        process.env.AWS_ACCESS_KEY_ID = Config.aws.accessId;
        process.env.AWS_SECRET_ACCESS_KEY = Config.aws.sceretKey;

        AWSServicesManager.dynamodbClient = new DynamoDBClient(AWSServicesManager.getDynamoDbConfig());

        AWSServicesManager.dynamodbDocClient = DynamoDBDocument.from(AWSServicesManager.dynamodbClient);
        AWSServicesManager.s3Client = new S3({
            region: Config.aws.region,
        });
    }

    static getDynamoDbConfig() {
        let dynamoDbConfig: DynamoDBClientConfig = {
            region: Config.aws.region
        };
        return dynamoDbConfig;
    }
    static getS3Client(): S3 {
        return AWSServicesManager.s3Client;
    }
    static getDynamodbClient(): DynamoDBClient {
        return AWSServicesManager.dynamodbClient
    }

    static getDynamodbDocClient(): DynamoDBDocument {
        return AWSServicesManager.dynamodbDocClient;
    }

}