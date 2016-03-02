blazer
=======

blazer is a node js library for BackBlaze B2. Note that this is currently a work
in progress and not all api is implemented yet.

Status:

0.0.2

 - added b2session - helper to do automatic retries
 - added store management to help in persisting/reusing tokens

0.0.1
 - upload_file
 - create_bucket
 - list_bucket
 - authorize_account


# Installation

```console
    npm install --save blazer
```

# Usage
```javascript

const { authorize_account, createB2 } = require('blazer');

/**
 * authorize_account is used to retrieve a b2 token which you can use
 * to create a b2Api via the b2 function. You can try to store this token once
 * retrieved an you can pass it to the b2 function to return an api
 */

//sample initialize to create a b2 Token

authorize_account(accountId, applicationKey).then ( token => {
    const b2 = createB2(token);

    //you can now use b2Api
    b2.upload_file(...);
    b2.create_bucket(...);

    //etc
});

```

## Buckets

### b2.create_bucket

    Create a B2 Bucket. The required argument is bucketName and bucketType.

```javascript
const bucketName = "myBucket";
const bucketType = "allPublic";

b2.create_bucket({bucketName, bucketType}).then( res => {
    console.log("bucket created ", res);
}).catch ( err => {
    console.log("error creating bucket");
});

````
    You can also use it directly, without passing from the b2 instance.

```javascript

const { buckets } = require('blazer');
const { create_bucket } = buckets;

create_bucket(token)({bucketName, bucketType}).then( res => {
    console.log('bucket created ', res);
}).catch ( err => {
    console.log('error creating bucket');
});


```

### b2.list_bucket

## Upload

### b2.get_upload_url

### b2.upload


# B2 Session

You can use the createB2 function to manually call a b2 api but if you use blazer
from some sort of a server app, then it would be convenient to have some facility to help you
do automatic retries and token keys management. The createB2Session calls does that
exactly.

## createB2Session

To create a b2Session object, call createB2Session passing in your accountId and applicationKey

```javascript
    const { createB2Session } = require('blazer');

    const b2Session = createB2Session( { accountId, applicationKey} );

    //use the api normally, b2session will automatically create token and
    //retry if needed
    b2Session.create_bucket(..)
```

## configuration

The second argument to createB2Session is a config file with the following attribute

### debug

if set to true, then more verbose log is outputted.

### maxRetry

the maximum number of calls when there is a failure before giving up.

### store

The store instance to use. By default it uses a memory store. You can pass your own
store object which is required to have the following attributes.

#### token

A function that returns the current token object.

#### persistToken

A function that accepts the newToken object and returns a promise which gets
resolved once the token has been persisted by the store.

#### invalidate

Invalidate the current active token. You need to set it to undefined such
that calls to token() will return falsy.

A sample implementation below

```javascript
const createMemoryStore = () => {
    var token;

    return {
        token() {
            return token;
        },
        persistToken(newToken) {
            token = newToken;
            return Promise.resolve(newToken);
        },
        invalidate() {
            token = undefined;
        }
    };
};

```

# Status

| Api Call        | Status        |
| --------------- |:-------------:|
| create_bucket   | done          |
| list_buckets    | done          |
| upload_file     | done          |
| authorized_account     | done          |
| get_upload_url     | done          |
| cancel_large_file     | pending          |
| delete_bucket     | done          |
| delete_file_version     | pending          |
| download_file_by_id     | pending          |
| download_file_by_name     | pending          |
| finish_large_file     | pending          |
| get_file_info     | pending          |
| get_upload_part_url     | pending          |
| get_upload_url     | pending          |
| hide_file     | pending          |
| list_file_names     | pending          |
| list_file_versions     | pending          |
| list_parts     | pending          |
| list_unfinished_large_files     | pending          |
| start_large_file     | pending          |
| update_bucket     | done          |
| upload_part     | pending          |


# Requirements

Node 5+ is required at the moment.

# Testing

npm run test


# FAQ

## If I need to pass the b2 functions, do I need to bind them to b2?

No. Functions on the B2 object are not dependent on the this context. You will
be able to pass the member around without worrying on binding b2

```javascript
someHandler( b2.create_bucket.bind(b2) ) //<--- you don't need to do this
someHandler( b2.create_bucket ); //<-- works fine
```
