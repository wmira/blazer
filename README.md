blazer
=======

blazer is a node js library for BackBlaze B2. Note that this is currently a work
in progress and not all api is implemented yet.

Status:

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
    You can also use this directly, without passing from the b2 instance.

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

# Requirements

node 5+ is required and with the following flags:

--harmony --harmony_modules --harmony_rest_parameters --harmony_destructuring

# Testing

npm run test


# FAQ

## If I need to pass the b2 functions, do I need to bind them to b2?

No. Functions on the B2 object are not dependent on this. Besides this is broken in javascript so it is designed such that you can pass the function around without worrying on context.

```javascript
someHandler( b2.create_bucket.bind(this) ) //<--- you don't need to do this!
someHandler( b2.create_bucket ); //<-- works fine
```
