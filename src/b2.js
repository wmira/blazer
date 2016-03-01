
const { create_bucket, list_buckets } = require('./buckets');
const { get_upload_url, upload_file } = require('./upload');
const { authorize_account } = require('./authorize_account');
const { createSessionHandler } = require('./sessionUtil');

/**
 * Token object here contains
  "accountId", "apiUrl", "authorizationToken", "downloadUrl"
 */
const createB2 = (token) => {

    if ( !token || !token.accountId || !token.apiUrl ||
            !token.authorizationToken || !token.downloadUrl ) {
        throw new Error('Invalid token object as argument.' , token);
    }
    const api = {
        create_bucket: create_bucket(token),
        list_buckets: list_buckets(token),
        get_upload_url: get_upload_url(token),
        upload_file: upload_file
    };
    return api;
};

const { keys } = Object;

const slackerFunc = () => {
    throw new Error('this is not yet implemented');
};

const apis = {
    authorize_account,
    create_bucket,
    list_buckets,
    get_upload_url,
    upload_file,
    b2_cancel_large_file: slackerFunc,
    b2_delete_bucket: slackerFunc,
    b2_delete_file_version: slackerFunc,
    b2_download_file_by_id: slackerFunc,
    b2_download_file_by_name: slackerFunc,
    b2_finish_large_file: slackerFunc,
    b2_get_file_info: slackerFunc,
    b2_get_upload_part_url: slackerFunc,
    b2_get_upload_url: slackerFunc,
    b2_hide_file: slackerFunc,
    b2_list_buckets: slackerFunc,
    b2_list_file_names: slackerFunc,
    b2_list_file_versions: slackerFunc,
    b2_list_parts: slackerFunc,
    b2_list_unfinished_large_files: slackerFunc,
    b2_start_large_file: slackerFunc,
    b2_update_bucket: slackerFunc,
    b2_upload_part:  slackerFunc
};


const createMemoryStore = () => {
    var token;
    var bucketUploadTokens = {};

    return {
        token(newToken) {
            if ( newToken ) {
                token = newToken;
            }
            return token;
        },

        bucketToken(bucketId, newToken) {
            if ( bucketId && newToken ) {
                bucketUploadTokens[bucketId] = newToken;
            }
            return bucketUploadTokens[bucketId];
        }
    };
};

const createB2Session = ( { accountId, applicationKey }, config ) => {

    var store = config.store || createMemoryStore();

    const api = {
        //if forced is true, then we retrieve a new token
        ready(forced) {
            if ( !store.token() || forced ) {
                return api.authorize_account(accountId, applicationKey).then( newToken => {
                    store.token(newToken);
                    return Promise.resolve(newToken);
                });
            } else {
                return Promise.resolve(store.token());
            }
        },


    };
    keys(apis).forEach( key => {
        //just incase
        if ( api[key] ) {
            throw new Error(key + ' is already a function in api');
        }
        api[key] = createSessionHandler( { api, store, theFunc: apis[key] } );
    });
};


module.exports = {
    createB2,
    authorize_account,
    createB2Session
};
