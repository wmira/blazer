
const https = require('https');
const { freeze, assign } = Object;

const BASE_PATH = '/b2api/v1';

const BASE_OPTION = freeze({
    hostname: 'api.backblaze.com',
    port: 443
});


const createApiHeader = ( bodyString, token ) => {
    const headers = {
        'charset': 'utf-8',
        'Content-Length': bodyString.length,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token.authorizationToken
    };
    return headers;
};

const toJSON = (buffer) => {
    if ( buffer ) {
        return JSON.parse(buffer.toString('utf-8'));
    }
};
const enrichParams = ( endPoint, params ) => {
    return assign({}, BASE_OPTION, { path: BASE_PATH  + endPoint }, params );
};

const hostnameFromApiUrl = (apiUrl) => {
    return apiUrl.substring('https://'.length);
};

const httpCall = (params, tosend)  => {

    return new Promise( (resolve, reject) => {
        const req = https.request(  params, ( res ) => {
            var buffer = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                buffer += chunk;
            });
            res.on('error', reject );
            res.on('end',() => {
                console.log('end');
                const objBuffer = buffer ? toJSON(buffer) : undefined;
                if ( res.statusCode === 200 ) { //anything other than 200 is a failure
                    resolve(objBuffer);
                } else {
                    reject({statusCode: res.statusCode, res: objBuffer});
                }

            });
        });
        if ( tosend ) {
            console.log('writing');
            req.write(tosend);
            console.log('writing done');
        }
        req.on('error', reject);
        //flush it
        req.end();
    });
};

module.exports = { httpCall, enrichParams, hostnameFromApiUrl, createApiHeader };
