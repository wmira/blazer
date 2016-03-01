

const should = require('should');
const { create_bucket } =  require('../lib/buckets') ;

describe('buckets', () => {

    describe('createBucket', () => {

        it('properly checks for required params', () => {
            const create = create_bucket({});
            const callCreate = function() {
                create({});
            };
            should(callCreate).throw(Error);

        });
    });
});
