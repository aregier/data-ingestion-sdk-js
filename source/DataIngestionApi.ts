import { ApiCredentials, BearerTokenCredentials, IAMCredentials } from '@adastradev/serverless-discovery-sdk';

// ignore type checking for private member aws-api-gateway-client for now
// declare function require(name:string): any; // tslint:disable-line
const apigClientFactory: any = require('aws-api-gateway-client').default; // tslint:disable-line

// interceptor logging for Authorization headers
// axios.interceptors.request.use(function(config) {
//     var authorizationHeader = config.headers['Authorization'];
//     console.log('Authorization header: ' + authorizationHeader);
//     return config;
// });

export class DataIngestionApi {
    private apigClient: any;
    private additionalParams: any;

    constructor(serviceEndpointUri: string, region: string, credentials: ApiCredentials) {
        if (credentials.type === 'None') {
            this.apigClient = apigClientFactory.newClient({
                accessKey: '',
                invokeUrl: serviceEndpointUri,
                region,
                secretKey: ''
            });
        } else if (credentials.type === 'IAM') {
            const iamCreds = credentials as IAMCredentials;
            this.apigClient = apigClientFactory.newClient({
                accessKey: iamCreds.accessKeyId,
                invokeUrl: serviceEndpointUri,
                region,
                secretKey: iamCreds.secretAccessKey
            });
        } else if (credentials.type === 'BearerToken') {
            const tokenCreds = credentials as BearerTokenCredentials;
            this.additionalParams = {
                headers: {
                    Authorization: 'Bearer ' + tokenCreds.idToken
                }
            };
            this.apigClient = apigClientFactory.newClient({
                accessKey: '',
                invokeUrl: serviceEndpointUri,
                region,
                secretKey: ''
            });
        } else {
            throw(Error('Unsupported credential type in DataIngestionApi'));
        }
    }

    public getSettings() {
        const params = {};
        const pathTemplate = '/ingestion/settings';
        const method = 'GET';
        const body = { };

        return this.apigClient.invokeApi(params, pathTemplate, method, this.additionalParams, body);
    }

    public getTenantSettings() {
        const params = {};
        const pathTemplate = '/ingestion/settings/tenant';
        const method = 'GET';
        const body = { };

        return this.apigClient.invokeApi(params, pathTemplate, method, this.additionalParams, body);
    }

}