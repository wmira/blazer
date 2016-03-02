
const { httpCall, enrichParams, hostnameFromApiUrl, createApiHeader } = require('./util');

const BUCKET_TYPE = {
    allPublic: 'allPublic',
    allPrivate: 'allPrivate'
};


const createHttpCall = ( token, body, endpoint ) => {

    const jsonString = JSON.stringify(body);
    const headers = createApiHeader( jsonString, token );
    return httpCall(enrichParams(endpoint,
        { method: 'POST', hostname: hostnameFromApiUrl(token.apiUrl), headers }  ), jsonString);
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
        return createHttpCall( token, body, '/b2_create_bucket' );

    };

};

/**
 * https://www.backblaze.com/b2/docs/b2_list_buckets.html
 */
const list_buckets = (token) => {

    return function() {

        const body = { accountId: token.accountId };
        return createHttpCall( token, body, '/b2_list_buckets' );
    };

};

/**
 * https://www.backblaze.com/b2/docs/b2_delete_bucket.html
 */
const delete_bucket = ( token ) => {

    return function( { bucketId }) {
        if ( !bucketId ) {
            throw new Error('bucketId is required.');
        }
        const body = { accountId: token.accountId, bucketId };
        return createHttpCall( token, body, '/b2_delete_bucket' );
    };
};

/**
 * https://www.backblaze.com/b2/docs/b2_update_bucket.html
 */
const update_bucket = ( token ) => {

    return function( { bucketId, bucketType }) {
        if ( !bucketId ) {
            throw new Error('bucketId is required.');
        }
        if ( !BUCKET_TYPE[bucketType] ) {
            throw new Error('Invalid bucketType ' + bucketType );
        }
        const body = { accountId: token.accountId, bucketId, bucketType };

        return createHttpCall( token, body, '/b2_update_bucket' );

    };
};

module.exports = {
    list_buckets,
    create_bucket,
    delete_bucket,
    update_bucket
};
