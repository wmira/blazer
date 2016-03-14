
const {  createHttpCall } = require('./util');

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

    return function( { bucketId, bucketType } ) {
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

const MAX_FILE_COUNT = 1000;

/**
 * https://www.backblaze.com/b2/docs/b2_list_file_names.html
 */
const list_file_names = ( token ) => {

    return function( { bucketId, startFileName, maxFileCount = 100 } ) {
        if ( !bucketId ) {
            throw new Error('bucketId is required.');
        }
        if ( maxFileCount > MAX_FILE_COUNT ) {
            throw new Error('maxFileCount > ' + MAX_FILE_COUNT);
        }
        const body = { bucketId, startFileName, maxFileCount };

        return createHttpCall( token, body, '/b2_list_file_names' );

    };
};

/**
 * https://www.backblaze.com/b2/docs/b2_list_file_versions.html
 */
const list_file_versions = ( token ) => {

    return function( { bucketId, startFileName, startFileId, maxFileCount = 100 } ) {
        if ( !bucketId ) {
            throw new Error('bucketId is required.');
        }
        if ( maxFileCount > MAX_FILE_COUNT ) {
            throw new Error('maxFileCount > ' + MAX_FILE_COUNT);
        }
        const body = { bucketId, startFileName, startFileId,  maxFileCount };

        return createHttpCall( token, body, '/b2_list_file_versions' );

    };
};

module.exports = {
    list_file_names,
    list_file_versions,
    list_buckets,
    create_bucket,
    delete_bucket,
    update_bucket
};
