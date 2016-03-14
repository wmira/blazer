
const fs = require('fs');

const createStore = () => {

    var token;
    var accountId;

    return {
        token() {
            return token;
        },
        persistToken(accountIdToPersist, newToken) {

            console.log('Persisting token....');
            //assign it first
            token = newToken;
            return new Promise ( (resolve, reject) => {
                fs.mkdirSync('~/.blazer');
                fs.writeFile('~/.blazer/' + accountIdToPersist , JSON.stringify(newToken) ,
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            accountId = accountIdToPersist;
                            resolve(newToken);
                        }
                    }
                );
            });
        },
        //invalidate the accountId
        invalidate() {
            token = undefined;
            fs.unlinkSync('~/.blazer/' + accountId);
        }
        // bucketToken(bucketId, newToken) {
        //     if ( bucketId && newToken ) {
        //         bucketUploadTokens[bucketId] = newToken;
        //     }
        //     return bucketUploadTokens[bucketId];
        // }
    };
};

module.exports = { createStore };
