

const createSessionHandler = function( { api, store, theFunc} ) {
    return function(arg) {
        return api.ready().then( () => {
            return theFunc(store.token())(arg).then( res => {
                return res;
            }, (err) => {
                if ( err && err.code === 'expired_auth_token' ) {
                    return api.token(true).then ( ()=> {
                        return theFunc( store.token() )( arg );
                    });
                }
                throw new Error(err);
            });
        }).catch ( err => {
            console.error(err);
            throw new Error(err);
        });
    };
};

module.exports = { createSessionHandler };
