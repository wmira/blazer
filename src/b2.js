
const { create_bucket, list_buckets } = require('./buckets');
const { get_upload_url, upload_file } = require('./upload');

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


module.exports = createB2 ;
