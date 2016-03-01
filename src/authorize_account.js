
const { httpCall, enrichParams } = require('./util');

const ENDPOINT = '/b2_authorize_account';
/**
 * https://www.backblaze.com/b2/docs/b2_authorize_account.html
 */
const authorize_account = (accountId, applicationKey) => {

    const headers = {
        headers: { Authorization: 'Basic ' + new Buffer(accountId + ':' + applicationKey).toString('base64') }
    };

    return httpCall(enrichParams(ENDPOINT, headers ));

};

module.exports = { authorize_account };
