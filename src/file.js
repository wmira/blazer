
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const { createHttpCall, httpCall, enrichParams, hostnameFromApiUrl, createApiHeader } = require('./util');

/**
 * https://www.backblaze.com/b2/docs/b2_get_upload_url.html
 */
const get_upload_url = (token) => {

    return function({bucketId}) {
        if ( !bucketId ) {
            throw new Error('bucketId is required');
        }

        const body = { bucketId };
        const jsonString = JSON.stringify(body);
        const headers = createApiHeader( jsonString, token );
        return httpCall(enrichParams('/b2_get_upload_url',
            { method: 'POST', hostname: hostnameFromApiUrl(token.apiUrl), headers }  ), jsonString);

    };

};

/**
 * Read the given file and return a promise
 */
const readFile = ( file ) => {
    var data = [];
    var len = 0;
    return new Promise( ( resolve, reject ) => {
        var readStream = fs.createReadStream(file);
        var hash = crypto.createHash('sha1');
        readStream.on('data',  (chunk) => {
            data.push(chunk);
            len += chunk.length;
            hash.update(chunk);
        });

        readStream.on('end', () => {
            var buffer = new Buffer(len);
            var position = 0;
            data.forEach( d => {
                d.copy(buffer, position);
                position += d.length;
            });

            resolve({hash: hash.digest('hex'), byteBuffer: buffer });
        });
        readStream.on('error',reject);
    });
};
/**
 * https://www.backblaze.com/b2/docs/b2_upload_file.html
 */
const upload_file = ({ uploadToken, file, contentType, fileName  }) => {
    if ( !contentType || !file ) {
        throw new Error('file and contentType is required');
    }
    const theFilename = fileName || path.basename(fileName);
    // the file you want to get the hash
    return new Promise ( (resolve, reject) => {
        readFile( file ).then( ({hash, byteBuffer}) => {

            const headers = {
                'X-Bz-File-Name': theFilename,
                'Content-Type': contentType,
                'Content-Length': byteBuffer.length,
                'X-Bz-Content-Sha1': hash,
                'Authorization': uploadToken.authorizationToken
            };

            const uploadUrl = uploadToken.uploadUrl;
            const pathWithNoHttps = uploadUrl.substring('https://'.length);
            const firstSlashIdx = pathWithNoHttps.indexOf('/');
            const hostname = pathWithNoHttps.substring(0, firstSlashIdx);
            const path = pathWithNoHttps.substring(firstSlashIdx + 1 );
            const noB2ApiPath = '/' +  path.substring('/b2api/v1'.length);

            httpCall(enrichParams(noB2ApiPath,
                { method: 'POST', hostname: hostname, headers }  ), byteBuffer)
                .then (resolve)
                .catch ( reject );

        });
    });
};

/**
 * https://www.backblaze.com/b2/docs/b2_get_file_info.html
 */
const get_file_info = (token) => {

    return function({fileId}) {
        if ( !fileId ) {
            throw new Error('fileId is required');
        }

        const body = { fileId };
        return createHttpCall( token, body, '/b2_get_file_info' );

    };

};

/**
 * https://www.backblaze.com/b2/docs/b2_hide_file.html
 */
const hide_file = (token) => {

    return function({bucketId, fileName}) {
        if ( !bucketId ) {
            throw new Error('bucketId is required');
        }
        if ( !fileName ) {
            throw new Error('fileName is required');
        }

        const body = { bucketId, fileName };
        return createHttpCall( token, body, '/b2_hide_file' );

    };
};

/**
 * https://www.backblaze.com/b2/docs/b2_delete_file_version.html
 */
const delete_file_version = (token) => {

    return function({fileName, fileId}) {
        if ( !fileName ) {
            throw new Error('fileName is required');
        }
        if ( !fileId ) {
            throw new Error('fileId is required');
        }

        const body = { fileName, fileId };
        return createHttpCall( token, body, '/b2_delete_file_version' );

    };

};


module.exports = { get_upload_url, upload_file, get_file_info, hide_file, delete_file_version };
