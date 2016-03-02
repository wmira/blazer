

const createExecRetry = (f, shouldRetry ) => {
    var currentRetry = 0;
    return function self(arg) {
        return f(arg).then( (res) => {
            return Promise.resolve(res);
        }, (err) => {
            if ( shouldRetry(err, currentRetry ) ) {
                currentRetry += 1;
                return self(arg);
            } else {
                throw new Error(err);
            }
        });
    };
};


const createSessionHandler = function( { api, store, apiCall, maxRetry = 2, name, debug = false} ) {
    const sequenceTokenApiCall = (arg) => {
        return new Promise( ( resolve, reject ) => {
            if ( debug ) {
                console.log('trying to call: ' + name  + ' with arg ', arg);
            }
            return api.ready().then ( () => {
                if ( debug ) {
                    console.log(' b2 session ready...calling ' + name);
                }
                return apiCall(store.token())(arg).then( (res) => {
                    resolve(res);
                }, err => {
                    console.error('error executing: ' + name, err);
                    reject(err);
                });
            }, err => {
                throw new Error(err);
            });
        });
    };
    return createExecRetry( sequenceTokenApiCall,
        (err, retryCount) => {
            if ( err && err.code === 'expired_auth_token' && retryCount < maxRetry ) {
                if ( debug ) {
                    console.log('expired token error, retrying sequence for ' + name);
                }
                store.invalidate();
                return true;
            }
            console.error('error ', err);
            return false;
        });

};

module.exports = { createExecRetry, createSessionHandler };
