
const { httpCall, enrichParams, hostnameFromApiUrl, createApiHeader } = require('./util');

const BUCKET_TYPE = {
    allPublic: 'allPublic',
    allPrivate: 'allPrivate'
};

/**
 * https://www.backblaze.com/b2/docs/b2_create_bucket.html
 */
const create_bucket = (token) => {

    return function({bucketName, bucketType}) {
        if ( !bucketName || !bucketType ) {
            throw new Error('Invalid bucketName or bucketType');
        }
        if ( !BUCKET_TYPE[bucketType] ) {
            throw new Error('Invalid bucketType ' + bucketType );
        }
        const body = { accountId: token.accountId, bucketName, bucketType };
        const jsonString = JSON.stringify(body);
        const headers = createApiHeader( jsonString, token );

        return httpCall(enrichParams('/b2_create_bucket', { method: 'POST', hostname: hostnameFromApiUrl(token.apiUrl), headers }  ), jsonString);

    };

};

/**
 * https://www.backblaze.com/b2/docs/b2_list_buckets.html
 */
const list_buckets = (token) => {

    return function() {

        const body = { accountId: token.accountId };
        const jsonString = JSON.stringify(body);
        const headers = createApiHeader( jsonString, token );

        return httpCall(enrichParams('/b2_list_buckets', { method: 'POST', hostname: hostnameFromApiUrl(token.apiUrl), headers }  ), jsonString);

    };

};

module.exports = { list_buckets, create_bucket };
